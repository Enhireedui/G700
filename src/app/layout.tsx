import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://g700.jetour.mn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "JETOUR G700 — Урьдчилсан захиалга | SAIN MOTORS",
  description:
    "JETOUR G700 — 2.0 Турбо, 2DHT, XWD дөрвөн дугуйн хөтлөгч. 904 морины хүч, 1,135 Нм, 0–100 км/ц 4.6 секунд. Хүрээт их бие, 900–970 мм ус туулах гүн. Урьдчилсан захиалга — SAIN MOTORS.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "JETOUR G700 — Урьдчилсан захиалга",
    description: "904 морины хүч, 1,135 Нм, 0–100 км/ц 4.6 секунд. Хүрээт их бие.",
    type: "website",
    locale: "mn_MN",
    url: "/",
    images: [{ url: "/models/g700/wide/cover.webp", width: 2000, height: 1125, alt: "JETOUR G700" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JETOUR G700 — Урьдчилсан захиалга",
    images: ["/models/g700/wide/cover.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body className={`${inter.variable} antialiased`}>
        <a href="#main" className="skip-link">
          Үндсэн агуулга руу шилжих
        </a>
        {children}
      </body>
    </html>
  );
}
