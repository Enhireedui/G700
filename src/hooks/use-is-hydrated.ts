"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Сервер дээр `false`, hydration дууссаны дараа `true`.
 *
 * Зөвхөн браузерт мэдэгддэг зүйлээс (`prefers-reduced-motion`, matchMedia,
 * framer-motion-ы style гэх мэт) шалтгаалж markup салаалах үед хэрэглэнэ —
 * эхний рендерийг сервертэйгээ ижил байлгаснаар hydration mismatch гарахгүй.
 *
 * `useEffect` + `setState`-ээс ялгаатай нь cascading render үүсгэхгүй.
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
