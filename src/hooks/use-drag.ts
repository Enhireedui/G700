"use client";

import { useRef } from "react";

/**
 * Слайдеруудад хулганаар чирэх / хуруугаар шудрах нэгдсэн логик.
 * Хоёр төрлийн слайдер байгаа тул хоёр hook:
 *
 *  useDragSwipe  — index/transform дээр ажилладаг слайдер (crossfade, translateX).
 *                  Чирээд тавихад onNext/onPrev дуудна.
 *  useDragScroll — төрөлхийн scroll (overflow-x + scroll-snap) контейнер.
 *                  Хулганаар чирэхийг нэмнэ; хуруунд хөндлөнгөөс оролцохгүй.
 */

const VELOCITY = 0.35; // px/ms — хурдан шударсныг босгонд хүрээгүй ч тооно

type SwipeOpts = {
  onNext: () => void;
  onPrev: () => void;
  /** Босго (px). Багавтар слайдерт бага, дэлгэц дүүрэнд их. */
  threshold?: number;
  /** Чирэлт эхлэх/дуусахад — autoplay-г түр зогсооход хэрэглэнэ */
  onStart?: () => void;
  onEnd?: () => void;
};

/**
 * Index-ээр солигддог слайдерт зориулав (transform эсвэл crossfade).
 * Босго/хурдаар шийднэ — чирэх үед зураг дагаж хөдөлдөггүй.
 *
 * `touchAction: "pan-y"`-г элемент дээр тавих шаардлагатай (доор style-аар
 * буцаж байна) — эс тэгвээс хэвтээ шудрахад хуудас босоо гүйхээ болино.
 */
export function useDragSwipe({
  onNext,
  onPrev,
  threshold = 48,
  onStart,
  onEnd,
}: SwipeOpts) {
  const st = useRef({ x: 0, y: 0, t: 0, active: false });

  const down = (e: React.PointerEvent) => {
    // Хулганы зөвхөн зүүн товч; хуруу/зүү нээлттэй
    if (e.pointerType === "mouse" && e.button !== 0) return;
    st.current = { x: e.clientX, y: e.clientY, t: performance.now(), active: true };
    onStart?.();
  };

  const up = (e: React.PointerEvent) => {
    if (!st.current.active) return;
    st.current.active = false;
    onEnd?.();
    const dx = e.clientX - st.current.x;
    const dy = e.clientY - st.current.y;
    // Босоо хөдөлгөөн давамгайлбал — хуудсын гүйлгэлт, слайдер хөндөхгүй
    if (Math.abs(dx) <= Math.abs(dy)) return;
    const v = Math.abs(dx) / Math.max(1, performance.now() - st.current.t);
    if (Math.abs(dx) < threshold && v < VELOCITY) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  const cancel = () => {
    if (!st.current.active) return;
    st.current.active = false;
    onEnd?.();
  };

  return {
    /** Слайдерын гадна хүрээнд тарааж тавина */
    handlers: {
      onPointerDown: down,
      onPointerUp: up,
      onPointerCancel: cancel,
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    },
    /** Хэвтээ чирэлт хуудсын босоо гүйлгэлтийг таслахгүй байлгана */
    style: { touchAction: "pan-y" as const },
    /** Хулганы хэрэглэгчид "чирч болно" гэдгийг мэдэх */
    className: "cursor-grab active:cursor-grabbing select-none",
  };
}

/**
 * Төрөлхийн scroll контейнерт (overflow-x-auto + snap) хулганаар чирэхийг нэмнэ.
 * Хуруу/trackpad-ыг хөндөхгүй — тэдний төрөлхийн momentum илүү сайн.
 *
 * Чирэх үед scroll-snap-ыг түр унтраана (эс тэгвээс snap чирэлтийг зөрүүлнэ),
 * гараа авахад хамгийн дөт цэг руу бэхлээд snap-ыг эргүүлж асаана.
 */
export function useDragScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  opts?: { reduce?: boolean; step?: () => number }
) {
  const drag = useRef({ x: 0, left: 0, active: false });

  const down = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, active: true };
    el.style.scrollSnapType = "none";
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
  };

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const up = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    try {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    } catch {}
    const step = opts?.step?.() ?? 0;
    if (step > 0) {
      el.scrollTo({
        left: Math.round(el.scrollLeft / step) * step,
        behavior: opts?.reduce ? "auto" : "smooth",
      });
    }
    window.setTimeout(
      () => {
        el.style.scrollSnapType = "";
      },
      opts?.reduce ? 0 : 420
    );
  };

  return {
    handlers: {
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: up,
      onPointerCancel: up,
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    },
    className: "cursor-grab active:cursor-grabbing select-none",
  };
}
