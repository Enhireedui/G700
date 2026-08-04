import { NextRequest, NextResponse } from "next/server";

/**
 * Урьдчилсан захиалга → Google Sheets.
 *
 * Apps Script Web App (webhook) руу сервер талаас дамжуулна. Ингэснээр нууц үг
 * браузерт харагдахгүй, спамаас хамгаална. Тохируулах заавар: README.md
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateMap = new Map<string, { count: number; firstAt: number }>();

function allowed(ip: string) {
  const now = Date.now();
  const hit = rateMap.get(ip);
  if (!hit || now - hit.firstAt > RATE_LIMIT_WINDOW_MS) {
    rateMap.set(ip, { count: 1, firstAt: now });
    return true;
  }
  if (hit.count >= RATE_LIMIT_MAX) return false;
  hit.count += 1;
  return true;
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!allowed(ip)) {
    return bad("Хэт олон хүсэлт. Нэг минутын дараа дахин оролдоно уу.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("Хүсэлтийн бүтэц буруу.");
  }

  const { name, phone, model } = (body ?? {}) as Record<string, unknown>;
  const nm = typeof name === "string" ? name.trim() : "";
  const ph = typeof phone === "string" ? phone.trim() : "";
  const digits = ph.replace(/\D/g, "");

  // Монголын дугаар: 8 оронтой, эсвэл 976 кодтой 11 оронтой
  const validPhone = digits.length === 8 || (digits.length === 11 && digits.startsWith("976"));

  if (!nm) return bad("Нэрээ оруулна уу.");
  if (!validPhone) return bad("Утасны дугаар 8 оронтой байх ёстой.");

  /**
   * Hosting-ийн панелд хуулахдаа хашилт, зай санамсаргүй орох нь их тохиолддог
   * (жишээ нь `"https://…"`). Тэднийг цэвэрлэж, хэлбэрийг шалгана.
   */
  const url = (process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .trim();

  if (!url) {
    console.error("[LEAD] GOOGLE_SHEETS_WEBHOOK_URL тохируулаагүй байна.");
    return bad("Сервер тохируулагдаагүй байна. Утсаар холбогдоно уу.", 500);
  }

  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) {
    console.error(
      "[LEAD] Webhook хаягийн хэлбэр буруу. Урт: " +
        url.length +
        ", төгсгөл: …" +
        url.slice(-12)
    );
    return bad("Сервер тохируулагдаагүй байна. Утсаар холбогдоно уу.", 500);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        createdAt: new Date().toISOString(),
        type: "Урьдчилсан захиалга",
        name: nm,
        phone: ph,
        model: typeof model === "string" ? model : "JETOUR G700",
        secret: process.env.GOOGLE_SHEETS_SECRET ?? "",
      }),
      // Apps Script нь заримдаа удаан хариулдаг (cold start) — 15 сек хүлээнэ
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error("[LEAD] Sheets webhook " + res.status + ": " + (await res.text()).slice(0, 300));
      return bad("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.", 502);
    }
  } catch (e) {
    console.error("[LEAD] Sheets: " + (e instanceof Error ? e.name + " " + e.message : String(e)));
    return bad("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.", 502);
  }

  console.log("[LEAD] " + nm + " (" + ph + ") → Sheets");
  return NextResponse.json({ ok: true, message: "Хүсэлт хүлээн авлаа." });
}
