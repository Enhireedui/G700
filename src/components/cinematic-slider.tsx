"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/image";
import { useIsHydrated } from "@/hooks/use-is-hydrated";

/* ============================================================
   Төрлүүд
   ============================================================ */

export type CinematicSlide = {
  /** Десктопын зураг (16:9) */
  image: string;
  /** Утасны зураг (9:16). Байвал lg-ээс доош үүнийг харуулна. */
  imageMobile?: string;
  /** Зураг тус бүрийн alt — байхгүй бол slider-ийн alt + дугаар */
  alt?: string;
  /** Заавал биш текст давхарга */
  headline?: string;
  description?: string;
  cta?: { label: string; href: string };
};

type Props = {
  slides: CinematicSlide[];
  /** Screen reader-т зориулсан ерөнхий тайлбар (загварын нэр) */
  alt: string;
  /** Автомат гүйлт (default: true) */
  autoplay?: boolean;
  /** Автомат гүйлтийн хугацаа, мс (default: 5000) */
  interval?: number;
  /** Эхний зургийг priority-гээр ачаалах (hero дээр true) */
  priority?: boolean;
  className?: string;
};

/* ============================================================
   Хөдөлгөөний тохиргоо — компонентын гадна, дахин үүсэхгүй
   ============================================================ */

/** cubic-bezier(0.22, 1, 0.36, 1) — Apple/Porsche маягийн зөөлөн гарц */
const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE_DURATION = 0.8;

/** Зөвхөн transform + opacity → GPU, 60 FPS */
const slideVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? "16%" : "-16%",
    scale: 1.06,
  }),
  center: {
    opacity: 1,
    x: "0%",
    scale: 1,
    transition: { duration: SLIDE_DURATION, ease: EASE },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? "-12%" : "12%",
    scale: 1.03,
    transition: { duration: SLIDE_DURATION, ease: EASE },
  }),
};

/** Хөдөлгөөн мэдрэмтгий хэрэглэгчид — зөвхөн opacity */
const reducedVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.3, ease: "linear" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "linear" } },
};

/**
 * Текстийн давхарга. Гарц нь зургаас хамаагүй хурдан (0.3s vs 0.8s) —
 * зураг сольж дуусахаас нааш текст аль хэдийн уншигдахгүй болсон байна.
 */
const textVariants: Variants = {
  enter: { opacity: 0, y: 22 },
  center: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: "linear" } },
};

/** Stagger — гарчиг → 120мс дараа тайлбар → 220мс дараа товч */
const TEXT_DELAY = { headline: 0.2, description: 0.32, cta: 0.42 } as const;

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 480;

/* ============================================================
   Зураг — десктоп/утас хос хувилбар
   ============================================================ */

const SlideImage = memo(function SlideImage({
  slide,
  alt,
  priority,
}: {
  slide: CinematicSlide;
  alt: string;
  priority?: boolean;
}) {
  const common = {
    alt: slide.alt ?? alt,
    fill: true as const,
    sizes: "100vw",
    priority,
    placeholder: "blur" as const,
    blurDataURL: BLUR_DATA_URL,
    draggable: false,
  };

  if (!slide.imageMobile) {
    return <Image src={slide.image} {...common} className="object-cover select-none" />;
  }

  return (
    <>
      <Image src={slide.imageMobile} {...common} className="lg:hidden object-cover select-none" />
      <Image src={slide.image} {...common} className="hidden lg:block object-cover select-none" />
    </>
  );
});

/* ============================================================
   Үндсэн компонент
   ============================================================ */

export function CinematicSlider({
  slides,
  alt,
  autoplay = true,
  interval = 5000,
  priority = false,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const count = slides.length;

  // page — хязгааргүй тоолуур; чиглэлийг зөрүүгээр гаргана
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  /**
   * Framer-ийн motion style-ыг сервер дээр рендер хийвэл client-тэй зөрж
   * hydration warning гаргадаг. Тиймээс эхний зургийг статикаар (SSR-д
   * тохирсон, LCP-д хэрэгтэй) харуулж, hydration дууссаны дараа хөдөлгөөнт
   * давхаргыг залгана.
   */
  const mounted = useIsHydrated();

  const index = ((page % count) + count) % count;
  const active = slides[index];

  const go = useCallback((delta: number) => {
    setPage(([p]) => [p + delta, delta]);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      setPage(([p]) => {
        const current = ((p % count) + count) % count;
        if (target === current) return [p, 0];
        return [p + (target - current), target > current ? 1 : -1];
      });
    },
    [count]
  );

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  /* ── Автомат гүйлт — hover, drag, далд таб, reduced-motion үед зогсоно ── */
  useEffect(() => {
    if (!autoplay || reduce || paused || dragging || count < 2) return;
    const t = window.setInterval(() => {
      if (!document.hidden) next();
    }, interval);
    return () => window.clearInterval(t);
  }, [autoplay, reduce, paused, dragging, count, interval, next, page]);

  /* ── Дараагийн зургийг урьдчилан татах ── */
  useEffect(() => {
    if (count < 2) return;
    const upcoming = slides[(index + 1) % count];
    const isNarrow =
      typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
    const src = (isNarrow && upcoming.imageMobile) || upcoming.image;
    const img = new window.Image();
    img.src = src;
  }, [index, count, slides]);

  /* ── Клавиатур ── */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  /* ── Чирэх / шудрах ── */
  const onDragEnd = useCallback(
    (_e: unknown, info: PanInfo) => {
      setDragging(false);
      const { offset, velocity } = info;
      if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) next();
      else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) prev();
    },
    [next, prev]
  );

  const variants = reduce ? reducedVariants : slideVariants;
  const hasText = Boolean(active.headline || active.description || active.cta);

  // Ken Burns — зөвхөн харагдаж байх хугацаанд, тайван, шугаман
  const kenBurns = useMemo(
    () =>
      reduce
        ? undefined
        : {
            initial: { scale: 1 },
            animate: { scale: 1.07 },
            transition: { duration: Math.max(interval / 1000 + 3, 8), ease: "linear" as const },
          },
    [reduce, interval]
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`absolute inset-0 overflow-hidden outline-none ${className}`}
    >
      {/* Mount хийгдэхээс өмнө — статик эхний зураг (сервер/client ижил) */}
      {!mounted ? (
        <div
          aria-roledescription="slide"
          aria-label={`1 / ${count}`}
          className="absolute inset-0"
        >
          <SlideImage slide={slides[0]} alt={alt} priority={priority} />
        </div>
      ) : (
        /* Чирэх давхарга — хяналтын товчнууд үүний гадна тул чирэхэд хөдлөхгүй */
        <motion.div
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={onDragEnd}
          className={`absolute inset-0 ${count > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial={page === 0 ? "center" : "enter"}
              animate="center"
              exit="exit"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${count}`}
              className="absolute inset-0 will-change-transform transform-gpu"
            >
              <motion.div {...kenBurns} className="absolute inset-0 will-change-transform">
                <SlideImage slide={active} alt={alt} priority={priority && page === 0} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Текст давхарга — зургаас тусдаа, өөрийн stagger-тай ── */}
      {hasText && (
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <AnimatePresence mode="wait">
            <div key={index} className="relative container-page pb-20 lg:pb-24">
              {active.headline && (
                <motion.h2
                  variants={textVariants}
                  custom={TEXT_DELAY.headline}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-white font-extrabold tracking-[-0.03em] leading-[1.05] text-[clamp(1.75rem,4vw,3.25rem)]"
                  style={{ textShadow: "0 4px 24px rgba(0,0,0,0.45)" }}
                >
                  {active.headline}
                </motion.h2>
              )}

              {active.description && (
                <motion.p
                  variants={textVariants}
                  custom={TEXT_DELAY.description}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="mt-3 max-w-xl text-white/85 text-[15px] lg:text-lg leading-relaxed"
                  style={{ textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}
                >
                  {active.description}
                </motion.p>
              )}

              {active.cta && (
                <motion.div
                  variants={textVariants}
                  custom={TEXT_DELAY.cta}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="mt-7 pointer-events-auto"
                >
                  <Link
                    href={active.cta.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#17181B] transition-colors hover:bg-[#E20A17] hover:text-white"
                  >
                    {active.cta.label}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>
      )}

      {/* ── Хяналт ── */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Өмнөх зураг"
            className="hidden lg:grid absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 place-items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-[#17181B] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Дараагийн зураг"
            className="hidden lg:grid absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 place-items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-[#17181B] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Цэгүүд — 4px зурвас, гэхдээ 44px товших талбайтай */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1"
            role="tablist"
            aria-label="Слайд сонгох"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}-р зураг`}
                aria-selected={i === index}
                className="relative grid place-items-center h-11 w-11"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-500 ${
                    i === index ? "w-8 bg-[#E20A17]" : "w-3.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Screen reader-т одоогийн слайдыг мэдэгдэнэ */}
      <p className="sr-only" aria-live="polite">
        {index + 1} / {count}
      </p>
    </div>
  );
}
