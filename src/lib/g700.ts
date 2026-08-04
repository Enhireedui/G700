/**
 * JETOUR G700 — хуудасны бүх агуулга.
 * Зөвхөн үйлдвэрээс ирсэн албан ёсны үзүүлэлт. Өгөгдлийн сан шаардахгүй —
 * нэг загварын хуудас тул текст, зургийг шууд эндээс уншина.
 */

export type Slide = {
  image: string;
  /** Утасны 9:16 хувилбар. Байвал lg-ээс доош үүнийг харуулна. */
  imageMobile?: string;
  caption: string;
};

const W = (n: string) => `/models/g700/wide/${n}.webp`;
const T = (n: string) => `/models/g700/tall/${n}.webp`;
const I = (n: string) => `/models/g700/interior/${n}.webp`;
const H = (n: string) => `/models/g700/tech/${n}.webp`;

export const G700 = {
  name: "JETOUR G700",
  tagline: "904 м.х, хүрээт их бие",
  description:
    "2.0 Турбо, 2DHT хурдны хайрцаг, XWD ухаалаг дөрвөн дугуйн хөтлөгч. 904 м.х, 1,135 Нм, 0–100 км/ц 4.6 секунд.",

  /** Hero слайдер — десктоп 16:9 / утас 9:16 хос */
  hero: [
    { image: W("cover"), imageMobile: T("cover") },
    { image: W("rock"), imageMobile: T("rock-ledge") },
    { image: W("sand"), imageMobile: T("sand") },
  ],

  exterior: [
    { image: W("dusk"), caption: "904 м.х, XWD 7+X горим" },
    { image: W("rock-red"), caption: "Хүрээт их бие — 5198 мм урт" },
    { image: W("climb"), caption: "Газраас тэнхлэг хүртэл 230 мм" },
    { image: W("canyon"), caption: "Тэнхлэг хоорондын зай 2870 мм" },
    { image: W("water-aerial"), caption: "Ус туулах гүн 900–970 мм" },
  ] satisfies Slide[],

  interior: [
    { image: I("black-red"), imageMobile: I("black-red-tall"), caption: "15.6 инчийн төв мэдрэгч дэлгэц" },
    { image: I("black-orange"), imageMobile: I("black-orange-tall"), caption: "Төв самбар — улбар шар" },
    { image: I("cabin-black"), imageMobile: I("cabin-black-tall"), caption: "Салон — хар" },
    { image: I("cabin-orange"), imageMobile: I("cabin-orange-tall"), caption: "Салон — улбар шар" },
    { image: I("rear-red"), imageMobile: I("rear-red-tall"), caption: "Хойд эгнээ — хар" },
    { image: I("rear-orange"), imageMobile: I("rear-orange-tall"), caption: "Хойд эгнээ — улбар шар" },
  ] satisfies Slide[],

  /** Онцлох боломжууд — зөвхөн нэр. Тоо баримт үзүүлэлтийн хүснэгтэд. */
  tech: [
    { image: H("engine"), title: "2.0 Турбо хөдөлгүүр" },
    { image: H("drivetrain"), title: "2DHT хурдны хайрцаг" },
    { image: H("battery"), title: "Lithium iron phosphate батарей" },
    { image: H("frame"), title: "Хүрээт их бие" },
  ],

  colors: [
    { name: "Хар", hex: "#1A1A1D", image: W("black") },
    { name: "Цагаан", hex: "#EDEDEF", image: W("white") },
    { name: "Мөнгөлөг", hex: "#B9BCC0", image: W("snow-silver") },
    { name: "Цэнхэр", hex: "#1F3A5F", image: W("capri-blue") },
    { name: "Улбар шар", hex: "#C4551E", image: W("dune-orange") },
    { name: "Бор", hex: "#6E5A48", image: W("brown") },
  ],

  video: {
    src: "/models/g700/video/tankturn.mp4",
    poster: W("rock"),
    title: "360° Tank Turn",
  },

  specs: {
    image: W("cover"),
    dimensions: { length: "5198 мм", width: "2050 мм", height: "1956 мм" },

    /**
     * Том тоогоор онцолж харуулах үзүүлэлтүүд.
     * Гарчиг нь үйлдвэрийн албан ёсны нэршлээр; нэгжийг монголоор.
     */
    figures: [
      { value: "904 м.х", label: "Чадал, морины хүч" },
      { value: "1,135 Нм", label: "Мушгих хүч" },
      { value: "4.6 сек", label: "0–100 км/ц" },
      { value: "1,300–1,400 км", label: "Нийт туулах зам" },
      { value: "100–150 км", label: "Цэвэр цахилгаан туулах зай" },
      { value: "900–970 мм", label: "Ус туулах гүн" },
      { value: "230 мм", label: "Газраас тэнхлэг хүртэл" },
      { value: "2870 мм", label: "Тэнхлэг хоорондын зай" },
      { value: "21°", label: "Үл тулах өнцөг" },
      { value: "9", label: "Жолоодлогын горим" },
    ],

    /** Тоогоор илэрхийлэгдэхгүй үзүүлэлтүүд — мөн албан ёсны нэршлээр */
    details: [
      { label: "Хөдөлгүүр", value: "2.0 Турбо" },
      { label: "Хурдны хайрцаг", value: "2DHT" },
      { label: "Хөтлөгч систем", value: "XWD ухаалаг дөрвөн дугуйн хөтлөгч, 7+X горим" },
      { label: "Батарей", value: "Lithium iron phosphate" },
      { label: "Кузовын бүтэц", value: "Хүрээт (Body-on-frame), рамтай их бие" },
      { label: "Төв дэлгэц", value: "15.6 инчийн мэдрэгч дэлгэц" },
      { label: "Дифференциал түгжигч", value: "Байгаа" },
      { label: "Танк турн", value: "Байгаа" },
    ],
  },
} as const;

export const CONTACT = {
  phone1: "7277-8855",
  phone1Href: "tel:+97672778855",
  phone2: "8910-0274",
  phone2Href: "tel:+97689100274",
  email: "marketing2@esain.mn",
} as const;
