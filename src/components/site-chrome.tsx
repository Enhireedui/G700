"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { CONTACT } from "@/lib/g700";

/**
 * Минимал навбар — цэс байхгүй. Зөвхөн лого + залгах товч.
 *
 * Дэвсгэр нь цагаан (hero нь навбарын доор биш, доогуур нь эхэлдэг) тул
 * лого, товч хоёр хар өнгөтэй. Скролл хийхэд зөвхөн доод зураас, сүүдэр
 * нэмэгдэнэ — өнгө хувирахгүй.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-white/95 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "border-b border-[#E7E7EA] shadow-[0_4px_20px_-14px_rgba(23,24,27,0.3)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/jetour-black.png" alt="JETOUR" className="h-7 w-auto" />
          <span className="w-px self-stretch bg-[#E7E7EA]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/sain-motors-black.png" alt="SAIN MOTORS" className="h-6 w-auto" />
        </span>

        <a
          href={CONTACT.phone1Href}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap bg-[#17181B] text-white hover:bg-[#E20A17] transition-colors"
        >
          <Phone className="w-4 h-4" />
          {CONTACT.phone1}
        </a>
      </div>
    </header>
  );
}

/** Минимал футер — холбоосын багана байхгүй, зөвхөн лого, дугаар, эрх. */
export function Footer() {
  return (
    <footer className="bg-[#17181B] text-white">
      <div className="container-page py-12 flex flex-wrap items-center justify-between gap-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/jetour-white.png" alt="JETOUR" className="h-9 w-auto" />
          <p className="text-sm text-white/50 mt-3">
            SAIN MOTORS — албан ёсны дистрибьютер
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
          <a href={CONTACT.phone1Href} className="hover:text-[#E20A17] transition-colors">
            {CONTACT.phone1}
          </a>
          <a href={CONTACT.phone2Href} className="hover:text-[#E20A17] transition-colors">
            {CONTACT.phone2}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-white/60 font-normal hover:text-white transition-colors"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-white/40">
          © {new Date().getFullYear()} JETOUR. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
}
