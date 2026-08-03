"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/image";
import { useDragScroll } from "@/hooks/use-drag";

/** Одоо байгаа өгөгдлийн бүтэц — techHighlights / safetyHighlights / qualityHighlights */
export type FeatureItem = {
  image: string;
  title: string;
  caption: string;
};

/**
 * Нэг feature — зураг дээр, текст доор (global сайтын маяг).
 * Бүх зураг ижил 3:2 харьцаатай тул эгнээ жигд, өндөр хэзээ ч хувирахгүй (CLS = 0).
 * (Эх зургууд 1.30 ба 1.78 тул 3:2 нь хамгийн тэнцвэртэй — хамгийн их 16% тайралт.)
 */
export function FeatureSlide({
  item,
  alt,
  index,
  total,
}: {
  item: FeatureItem;
  alt: string;
  index: number;
  total: number;
}) {
  return (
    <li
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}`}
      /* Desktop 30% → 3 бүтэн + 4-дэх нь хэсэгчлэн харагдана */
      className="snap-start shrink-0 basis-[78%] sm:basis-[45%] lg:basis-[30%]"
    >
      <div className="relative w-full aspect-[3/2] overflow-hidden rounded-[20px] bg-[#F5F5F6]">
        <Image
          src={item.image}
          alt={alt ? `${alt} — ${item.title}` : item.title}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 30vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      <div className="mt-6 text-center px-1">
        <h3 className="text-[#17181B] font-bold text-lg lg:text-xl leading-snug">
          {item.title}
        </h3>
        {item.caption && (
          <p className="mt-2.5 text-[#54585F] text-[0.9375rem] lg:text-base leading-relaxed max-w-[380px] mx-auto">
            {item.caption}
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * Онцлох боломжуудын хэвтээ эгнээ — зэрэг 3 харагдаж, дараагийнх нь хэсэгчлэн
 * харагдана (global Jetour сайтын "Safety & Intelligent" маяг).
 *
 * Хөдөлгөөнд CSS scroll-snap ашигласан: хуруугаар шудрах, trackpad, дугуй,
 * гарын сум бүгд эх сурвалжаасаа ажиллана — momentum нь төрөлхийн, JS хэмжилт
 * хэрэггүй. Хулганы хэрэглэгчдэд сум нэмсэн. Autoplay БАЙХГҮЙ.
 */
export function FeatureSlider({
  items,
  alt = "",
  heading,
  subheading,
}: {
  items: FeatureItem[];
  alt?: string;
  heading: string;
  subheading?: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [reduce, setReduce] = useState(false);
  const headingId = useId();

  const total = items.length;

  // matchMedia-г effect дотор — SSR ба client эхний render ижил тул hydration зөрөхгүй
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 1);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(max - el.scrollLeft <= 2);
  }, []);

  useEffect(() => {
    onScroll();
  }, [onScroll, total]);

  const cardStep = () => {
    const el = scrollerRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 24 : (el?.clientWidth ?? 0) * 0.8;
  };

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * cardStep(), behavior: reduce ? "auto" : "smooth" });
  };

  // Хулганаар чирэх — хуруунд хөндлөнгөөс оролцохгүй (төрөлхийн momentum илүү сайн)
  const dragScroll = useDragScroll(scrollerRef, { reduce, step: cardStep });

  if (total === 0) return null;

  return (
    <section className="section-pad bg-white">
      {/* Гарчиг */}
      <div className="container-page">
        <h2
          id={headingId}
          className="text-[#17181B] font-extrabold tracking-[-0.025em]"
          style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
        >
          {heading}
        </h2>
        {subheading && <p className="type-lead mt-4 max-w-[560px]">{subheading}</p>}
      </div>

      {/* Хэвтээ эгнээ — scroll-snap */}
      <ul
        ref={scrollerRef}
        onScroll={onScroll}
        {...dragScroll.handlers}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-labelledby={headingId}
        className={`mt-12 lg:mt-16 flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide
                   px-[3vw] scroll-px-[3vw] ${dragScroll.className}
                   focus-visible:outline-2 focus-visible:outline-[#E20A17] focus-visible:outline-offset-4`}
        style={{ scrollbarWidth: "none", overscrollBehaviorX: "contain" }}
      >
        {items.map((it, i) => (
          <FeatureSlide
            key={`${it.image}-${i}`}
            item={it}
            alt={alt}
            index={i}
            total={total}
          />
        ))}
      </ul>

      {/* Прогресс + сум — прогресс нь гүйлгэх үед дүүрнэ */}
      <div className="container-page mt-10 flex items-center gap-6">
        <div
          className="flex-1 h-[2px] bg-[#E7E7EA] rounded-full overflow-hidden"
          role="progressbar"
          aria-label="Гүйлгэх байдал"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full bg-[#17181B] origin-left transition-transform duration-200 ease-out"
            style={{ width: "100%", transform: `scaleX(${Math.max(0.06, progress)})` }}
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Өмнөх"
            className="w-11 h-11 grid place-items-center rounded-full border border-[#D9DADE] text-[#17181B] transition-colors hover:border-[#17181B] hover:bg-[#17181B] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#17181B] disabled:hover:border-[#D9DADE] disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Дараах"
            className="w-11 h-11 grid place-items-center rounded-full border border-[#D9DADE] text-[#17181B] transition-colors hover:border-[#17181B] hover:bg-[#17181B] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#17181B] disabled:hover:border-[#D9DADE] disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
