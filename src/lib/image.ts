// Зургийн нэгдсэн туслах утгууд.

// Blur placeholder — зураг ачаалагдах хүртэл зөөлөн саарал бүдэг дэвсгэр.
// 1x1 цайвар саарал (#F5F5F6) PNG — next/image үүнийг бүдгэрүүлж fade-in өгнө.
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

// ISR — CMS агуулга шинэчлэгдэхэд хэдэн секунд тутам дахин үүсгэх (сервер ачаалал ↓).
// 10 минут: борлуулалтын сайтад тохиромжтой тэнцвэр (шинэчлэлт удахгүй харагдана,
// сервер бараг ачаалалгүй). Admin өөрчлөлт дээд тал нь 10 минутын дараа гарна.
export const REVALIDATE_SECONDS = 600;
