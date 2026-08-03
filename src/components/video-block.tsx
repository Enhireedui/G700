"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useIsHydrated } from "@/hooks/use-is-hydrated";

export function VideoBlock({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title?: string;
}) {
  const reduce = useReducedMotion();
  /** prefers-reduced-motion нь сервер дээр мэдэгдэхгүй тул hydration хүртэл салаалахгүй */
  const hydrated = useIsHydrated();
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const [muted, setMuted] = useState(true);
  const [manualStarted, setManualStarted] = useState(false);

  /**
   * Дэлгэцэнд орж ирэхэд дуугүйгээр автоматаар тоглоно, гарахад зогсоно.
   * rootMargin-аар бага зэрэг эрт (200px) ачаалж эхэлдэг.
   * preload="none" — доош гүйхгүй хүн юу ч татахгүй.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    // Далд таб дээр Chrome дуугүй бичлэгийг зогсоодог тул таб эргэж
    // харагдахад дахин оролдоно (эс тэгвээс хөшсөн фрэйм үлдэнэ).
    const tryPlay = () => {
      if (inView.current && !document.hidden) el.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) tryPlay();
        else el.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    io.observe(el);
    document.addEventListener("visibilitychange", tryPlay);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [reduce]);

  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) el.play().catch(() => {});
  };

  const startManually = () => {
    setManualStarted(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  const showPlayButton = hydrated && reduce && !manualStarted;

  return (
    <section id="video" className="bg-[#0E0E10] scroll-mt-16">
      <div className="relative w-full aspect-video overflow-hidden">
        <video
          ref={ref}
          src={src}
          poster={poster}
          preload="none"
          playsInline
          muted={muted}
          loop
          // Дуу нээсэн үед л native хяналт — тэгэхгүй бол цэвэр, ambient
          controls={!muted}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {title && (
          <div className="absolute inset-x-0 bottom-0 pointer-events-none">
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative px-6 lg:px-10 pb-8 lg:pb-10 max-w-xl">
              <p
                className="text-white font-bold text-lg lg:text-2xl"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}
              >
                {title}
              </p>
            </div>
          </div>
        )}

        {!showPlayButton && (
          <button
            onClick={toggleSound}
            aria-label={muted ? "Дуу нээх" : "Дуу хаах"}
            className="absolute top-5 right-5 lg:top-6 lg:right-6 z-10 grid place-items-center w-11 h-11 rounded-full bg-black/35 border border-white/25 backdrop-blur-sm text-white hover:bg-white hover:text-[#17181B] transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}

        {/* Хөдөлгөөн мэдрэмтгий хэрэглэгчид — гараар тоглуулах */}
        {showPlayButton && (
          <>
            <div className="absolute inset-0 bg-black/35 pointer-events-none" />
            <button
              onClick={startManually}
              aria-label={title ? `${title} — бичлэг тоглуулах` : "Бичлэг тоглуулах"}
              className="absolute inset-0 grid place-items-center group"
            >
              <span className="grid place-items-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/15 border border-white/50 backdrop-blur-sm text-white transition-all group-hover:bg-white group-hover:text-[#17181B] group-hover:scale-105">
                <Play className="w-7 h-7 lg:w-8 lg:h-8 ml-0.5" />
              </span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
