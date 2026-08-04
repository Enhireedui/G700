"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Phone } from "lucide-react";
import { CONTACT, G700 } from "@/lib/g700";

type State = "idle" | "sending" | "done";

/** Урьдчилсан захиалга — зөвхөн нэр, утас. Мэдээлэл Google Sheets-т бичигдэнэ. */
export function OrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setError(null);

    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) return setError("Нэрээ оруулна уу.");
    if (digits.length !== 8) return setError("Утасны дугаар 8 оронтой байх ёстой.");

    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), model: G700.name }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Алдаа гарлаа");
      setState("done");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  return (
    <section
      id="order"
      className="section-pad bg-[#F5F5F6] border-t border-[#E7E7EA] scroll-mt-16"
    >
      <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="type-h2 text-[#17181B] mb-5">Урьдчилсан захиалга</h2>
          <p className="type-lead mb-7 max-w-md">
            Холбоо барих мэдээллээ үлдээнэ үү. Манай зөвлөх удахгүй тантай холбогдох болно.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={CONTACT.phone1Href}
              className="btn-outline-jetour inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              {CONTACT.phone1}
            </a>
            <a
              href={CONTACT.phone2Href}
              className="btn-outline-jetour inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              {CONTACT.phone2}
            </a>
          </div>
        </motion.div>

        <div className="bg-white border border-[#E7E7EA] rounded-3xl p-6 lg:p-8">
          {state === "done" ? (
            <div className="text-center py-8">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#E20A17] text-white">
                <Check className="h-7 w-7" />
              </span>
              <p className="mt-5 text-lg font-bold text-[#17181B]">Хүсэлт хүлээн авлаа</p>
              <p className="mt-2 type-small">Бид тантай 24 цагийн дотор холбогдоно.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-6 bg-[#E20A17] rounded-full" />
                <h3 className="font-extrabold text-xl lg:text-2xl text-[#17181B]">
                  Захиалгын хүсэлт
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="nm"
                    className="block text-[0.6rem] tracking-[0.18em] uppercase text-[#6B7280] font-semibold mb-1.5"
                  >
                    Овог, нэр
                  </label>
                  <input
                    id="nm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Бат-Эрдэнэ"
                    className="w-full rounded-xl border-2 border-[#DDDEE1] bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[#E20A17]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ph"
                    className="block text-[0.6rem] tracking-[0.18em] uppercase text-[#6B7280] font-semibold mb-1.5"
                  >
                    Утасны дугаар
                  </label>
                  <input
                    id="ph"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="9911 2233"
                    className="w-full rounded-xl border-2 border-[#DDDEE1] bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[#E20A17]"
                  />
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-[#C81E1E]">{error}</p>}

              <button
                type="submit"
                disabled={state === "sending"}
                className="btn-electric-jetour w-full mt-6 py-4 rounded-xl text-sm gap-2"
              >
                {state === "sending" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Захиалга бүртгүүлэх"
                )}
              </button>

              <p className="mt-3 text-[0.6875rem] leading-relaxed text-[#6B7280] text-center">
                Илгээсэн мэдээллийг зөвхөн эргэн холбогдох зорилгоор ашиглана.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
