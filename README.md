# JETOUR G700 — урьдчилсан захиалгын хуудас

Зөвхөн G700-д зориулсан бие даасан нэг хуудас. Next.js 16 + React 19 +
Tailwind v4 + framer-motion. Өгөгдлийн сан шаардахгүй — агуулга нь
[`src/lib/g700.ts`](src/lib/g700.ts) дотор.

Формын мэдээлэл **Google Sheets** руу бичигдэнэ.

---

## Ажиллуулах

```bash
npm install
npm run dev
```

`http://localhost:3000` дээр нээгдэнэ.

```bash
npm run build && npm start   # production
```

---

## Google Sheets тохируулах (заавал)

Ингэж тохируулаагүй бол форм илгээхэд
«Сервер тохируулагдаагүй байна» гэсэн алдаа гарна.

### 1. Хүснэгтийн гарчиг

Хүснэгтийн **1-р мөрөнд**:

| A | B | C | D | E |
|---|---|---|---|---|
| Огноо | Төрөл | Нэр | Утас | Загвар |

### 2. Apps Script

Хүснэгт дээрээ **Extensions → Apps Script**, доорх кодыг тавина:

```javascript
// Сайтын .env дэх GOOGLE_SHEETS_SECRET-тэй ижил байх (хоосон бол шалгахгүй)
const SECRET = '';

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (SECRET && d.secret !== SECRET) {
      return ContentService.createTextOutput('forbidden');
    }
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
      new Date(d.createdAt || Date.now()),
      d.type  || '',
      d.name  || '',
      d.phone || '',
      d.model || '',
    ]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}
```

### 3. Web App болгож нийтлэх

**Deploy → New deployment**:

| Тохиргоо | Утга |
|---|---|
| Type | **Web app** |
| Execute as | **Me** |
| Who has access | **Anyone** |

Гарах **Web app URL**-ыг хуулна (`https://script.google.com/macros/s/…/exec`).

> `Anyone` гэдэг нь хүснэгтийг нээж байгаа биш — зөвхөн скриптийг дуудах
> боломжтой болгож байна. Хүснэгт өөрөө хаалттай хэвээр.

### 4. `.env` файл

Төслийн эх хэсэгт `.env` үүсгээд:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
GOOGLE_SHEETS_SECRET=
```

Серверээ дахин ачаална. `.env` нь git-д орохгүй (`.gitignore`).

**Webhook URL нь зөвхөн сервер тал дээр** уншигддаг — браузерт харагдахгүй,
тиймээс хаягийг олж спам бичих боломжгүй. Нэмэлт хамгаалалт хүсвэл
`GOOGLE_SHEETS_SECRET`-ийг Apps Script-ийн `SECRET`-тэй хамт тохируулна.

---

## Хуудасны бүтэц

| # | Хэсэг | Файл |
|---|---|---|
| 1 | Hero слайдер (3 зураг) | [`cinematic-slider.tsx`](src/components/cinematic-slider.tsx) |
| 2 | Гадна үзэмж (5) | [`showcase-slider.tsx`](src/components/showcase-slider.tsx) |
| 3 | Дотор салон (6) | ↑ мөн адил |
| 4 | Tank Turn — бичлэг | [`video-block.tsx`](src/components/video-block.tsx) |
| 5 | Онцлох боломжууд (4) | [`feature-slider.tsx`](src/components/feature-slider.tsx) |
| 6 | Өнгөний сонголт (6) | [`color-picker.tsx`](src/components/color-picker.tsx) |
| 7 | Техник үзүүлэлт | [`page.tsx`](src/app/page.tsx) |
| 8 | Урьдчилсан захиалга | [`order-form.tsx`](src/components/order-form.tsx) |

**Зураг:** десктопт 16:9, утсанд 9:16 хос хувилбар. `next/image` тул
хэрэгтэй хэмжээ, AVIF/WebP форматаар л татагдана.

**Бичлэг:** дэлгэцэнд орж ирэхэд дуугүй автоматаар тоглоно (`preload="none"`
тул доош гүйхгүй хүн юу ч татахгүй). Баруун дээд булангаас дуу нээнэ.

**Хөдөлгөөн:** `prefers-reduced-motion` тохиргоотой хэрэглэгчид анимаци
унтарч, бичлэг гараар тоглуулах болно.

---

## Агуулга шинэчлэх

Бүх текст, зураг, өнгө [`src/lib/g700.ts`](src/lib/g700.ts) дотор:

| Юу | Талбар |
|---|---|
| Hero зургууд | `hero` |
| Гадна үзэмжийн слайд, тайлбар | `exterior` |
| Салоны слайд, тайлбар | `interior` |
| Онцлох боломжууд | `tech` |
| Өнгө (нэр, hex, зураг) | `colors` |
| Техник үзүүлэлт | `specs.rows` |
| Утас, и-мэйл | `CONTACT` |

Зургууд `public/models/g700/` дор: `wide/` (16:9), `tall/` (9:16),
`interior/`, `tech/`, `video/`.

---

## Байршуулах

Serverless функц (form API) хэрэгтэй тул Vercel эсвэл Node-той хостинг:

| Хувилбар | Тохиргоо |
|---|---|
| **Vercel** | Repo холбоод `GOOGLE_SHEETS_WEBHOOK_URL` env нэмэх |
| Netlify | Next adapter + env |
| VPS / Node | `npm run build && npm start`, reverse proxy |
