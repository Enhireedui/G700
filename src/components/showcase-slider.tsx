"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/image";
import { useDragSwipe } from "@/hooks/use-drag";
import type { Slide } from "@/lib/g700";

/**
 * Дэлгэц дүүрэн слайдерын зураг.
 * imageMobile (9:16) байвал утсанд түүнийг, lg-ээс дээш өргөн (16:9) хувилбарыг
 * харуулна — хоёулаа object-cover тул тайрагдахгүй.
 *
 * containMobile: слайдер 9:16 хайрцагтай атал энэ слайдад утасны хувилбар
 * байхгүй үед. Ийм үед object-contain — өргөн зураг бүтнээрээ багтана.
 */
function SlideImage({
  src,
  srcMobile,
  alt,
  priority,
  containMobile,
}: {
  src: string;
  srcMobile?: string;
  alt: string;
  priority?: boolean;
  containMobile?: boolean;
}) {
  const common = {
    alt,
    fill: true as const,
    sizes: "100vw",
    placeholder: "blur" as const,
    blurDataURL: BLUR_DATA_URL,
  };

  if (!srcMobile) {
    return (
      <Image
        src={src}
        {...common}
        priority={priority}
        className={containMobile ? "object-contain lg:object-cover" : "object-cover"}
      />
    );
  }

  return (
    <>
      <Image src={srcMobile} {...common} priority={priority} className="lg:hidden object-cover" />
      <Image src={src} {...common} priority={priority} className="hidden lg:block object-cover" />
    </>
  );
}

/**
 * Дэлгэц дүүрэн, гүйж солигддог слайдер тайлбартай.
 * 5 сек тутам автоматаар солигдоно; hover/чирэх үед зогсоно.
 */
export function ShowcaseSlider({ slides, alt }: { slides: readonly Slide[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((p) => (p + 1) % slides.length), [slides.length]);
  const prev = useCallback(
    () => setActive((p) => (p - 1 + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!document.hidden) next();
    }, 5000);
    return () => clearInterval(t);
  }, [next, paused, slides.length, active]);

  const swipe = useDragSwipe({
    onNext: next,
    onPrev: prev,
    threshold: 60,
    onStart: () => setPaused(true),
    onEnd: () => setPaused(false),
  });

  // Утасны хайрцгийн харьцаа: 9:16 хувилбар байвал 9/16, байхгүй бол 16/9.
  const hasMobile = slides.some((s) => s.imageMobile);

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0E0E10] ${
        hasMobile ? "aspect-[9/16]" : "aspect-video"
      } lg:aspect-auto lg:h-[clamp(520px,calc(100vh+4rem),1280px)] ${
        slides.length > 1 ? swipe.className : ""
      }`}
      style={slides.length > 1 ? swipe.style : undefined}
      {...(slides.length > 1 ? swipe.handlers : {})}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="relative min-w-full h-full">
            <SlideImage
              src={s.image}
              srcMobile={s.imageMobile}
              alt={`${alt} — ${s.caption}`}
              priority={i === 0}
              containMobile={hasMobile && !s.imageMobile}
            />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none" />
            <p
              className="absolute left-6 lg:left-10 bottom-10 lg:bottom-24 text-white font-bold text-lg lg:text-2xl max-w-xl pr-6"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.6)" }}
            >
              {s.caption}
            </p>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          {/* Сумнууд — зөвхөн десктоп. Утсанд шудрах боломжтой тул хэрэггүй. */}
          <div className="absolute bottom-24 right-10 z-10 hidden lg:flex gap-2">
            <button
              onClick={prev}
              aria-label="Өмнөх зураг"
              className="w-10 h-10 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-[#17181B] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Дараагийн зураг"
              className="w-10 h-10 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-[#17181B] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Байрлалыг зөвхөн цэгээр илэрхийлнэ */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`${i + 1}-р зураг`}
                aria-current={i === active}
                className={`h-1 rounded-full transition-all ${
                  i === active ? "w-7 bg-[#E20A17]" : "w-3.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
