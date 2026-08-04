"use client";

import { useState } from "react";
import Image from "next/image";
import { G700 } from "@/lib/g700";

/**
 * Өнгө солиход зөвхөн машины өнгө л солигдоно — ижил өнцөг, ижил дэвсгэр
 * дээрх зургууд crossfade хийгдэнэ.
 */
export function ColorPicker() {
  const [idx, setIdx] = useState(0);

  return (
    <section id="colors" className="section-pad bg-white overflow-hidden">
      <div className="text-center mb-8 lg:mb-10 px-6">
        <h2 className="type-h2 text-[#17181B] mb-2">{G700.name}</h2>
        <p className="text-[#6B7280] text-base lg:text-lg">Өнгөний сонголтууд</p>
      </div>

      <div
        className="flex flex-wrap items-stretch justify-center gap-2 lg:gap-3 mb-6 lg:mb-8 px-6"
        role="tablist"
        aria-label="Өнгө сонгох"
      >
        {G700.colors.map((c, i) => (
          <button
            key={c.name}
            role="tab"
            aria-selected={idx === i}
            onClick={() => setIdx(i)}
            className={`flex flex-col items-center gap-2 rounded-xl px-4 py-3 transition-colors ${
              idx === i
                ? "border border-[#17181B]/40 bg-[#FAFAFB]"
                : "border border-transparent hover:bg-[#F5F5F6]"
            }`}
          >
            <span
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full ring-1 ring-black/10"
              style={{ background: c.hex }}
            />
            <span
              className={`text-xs lg:text-sm font-bold ${
                idx === i ? "text-[#17181B]" : "text-[#6B7280]"
              }`}
            >
              {c.name}
            </span>
          </button>
        ))}
      </div>

      <div className="relative mx-auto w-[min(1000px,94vw)] aspect-[16/9] rounded-2xl overflow-hidden bg-[#0E0E10]">
        {G700.colors.map((c, i) => (
          <Image
            key={c.image}
            src={c.image}
            alt={`${G700.name} — ${c.name}`}
            fill
            sizes="(max-width: 1000px) 94vw, 1000px"
            className={`object-cover transition-opacity duration-500 ease-out ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={idx !== i}
          />
        ))}
      </div>
    </section>
  );
}
