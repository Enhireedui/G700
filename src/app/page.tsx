import { ArrowDown } from "lucide-react";
import { G700 } from "@/lib/g700";
import { Header, Footer } from "@/components/site-chrome";
import { CinematicSlider, type CinematicSlide } from "@/components/cinematic-slider";
import { ShowcaseSlider } from "@/components/showcase-slider";
import { VideoBlock } from "@/components/video-block";
import { ColorPicker } from "@/components/color-picker";
import { OrderForm } from "@/components/order-form";
import { FeatureSlider, type FeatureItem } from "@/components/feature-slider";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Car",
  name: G700.name,
  brand: { "@type": "Brand", name: "JETOUR" },
  description: G700.description,
  image: G700.specs.image,
  bodyType: "SUV",
  vehicleTransmission: "2DHT",
  driveWheelConfiguration: "https://schema.org/AllWheelDriveConfiguration",
  vehicleEngine: {
    "@type": "EngineSpecification",
    engineType: "2.0 Turbo",
    enginePower: { "@type": "QuantitativeValue", value: 904, unitCode: "BHP" },
    torque: { "@type": "QuantitativeValue", value: 1135, unitCode: "NU" },
  },
  accelerationTime: { "@type": "QuantitativeValue", value: 4.6, unitCode: "SEC" },
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/PreOrder",
    seller: { "@type": "AutoDealer", name: "SAIN MOTORS" },
  },
};

const heroSlides: CinematicSlide[] = G700.hero.map((s) => ({
  image: s.image,
  imageMobile: s.imageMobile,
}));

const featureItems: FeatureItem[] = G700.tech.map((t) => ({
  image: t.image,
  title: t.title,
  caption: "",
}));

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div id="main" className="min-h-screen bg-white text-[#17181B]">
        <Header />
        <div className="h-16" />

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#17181B] aspect-[9/16] lg:aspect-auto lg:h-[calc(100svh-4rem)] lg:min-h-[520px]">
          <CinematicSlider slides={heroSlides} alt={G700.name} priority />
          {/* Зураг дээр текст байхгүй ч хуудсанд H1 хэрэгтэй — SEO ба screen reader */}
          <h1 className="sr-only">{G700.name}</h1>
        </section>

        {/* ── Экстерьер ── */}
        <section id="exterior" className="bg-white pt-16 lg:pt-20 overflow-hidden scroll-mt-16">
          <div className="container-page mb-6">
            <h2 className="type-h2 text-[#17181B]">Экстерьер</h2>
          </div>
          <ShowcaseSlider slides={G700.exterior} alt={G700.name} />
        </section>

        {/* ── Интерьер ── */}
        <section id="interior" className="bg-[#F5F5F6] pt-16 lg:pt-20 overflow-hidden scroll-mt-16">
          <div className="container-page mb-6">
            <h2 className="type-h2 text-[#17181B]">Интерьер</h2>
          </div>
          <ShowcaseSlider slides={G700.interior} alt={G700.name} />
        </section>

        {/* ── Бичлэг ── */}
        <VideoBlock src={G700.video.src} poster={G700.video.poster} title={G700.video.title} />

        {/* ── Онцлох боломжууд ── */}
        <FeatureSlider items={featureItems} alt={G700.name} heading="Онцлох технологи" />

        {/* ── Өнгөний сонголт ── */}
        <ColorPicker />

        {/* ── Үндсэн үзүүлэлтүүд ──
             Хүрээ, карт, зураггүй. Зөвхөн том тоо, богино гарчиг, нарийн
             зураас — албан ёсны үзүүлэлтийн хуудасны цэвэр бүтэц. */}
        <section id="specs" className="section-pad bg-white scroll-mt-16">
          <div className="container-page">
            <h2 className="type-h2 text-[#17181B] mb-12 lg:mb-16">Үндсэн үзүүлэлтүүд</h2>

            <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-y-12">
              {G700.specs.figures.map((f) => (
                <div key={f.label}>
                  <dd className="font-extrabold tracking-[-0.02em] text-[#17181B] text-[1.625rem] lg:text-[2rem] leading-none">
                    {f.value}
                  </dd>
                  <dt className="mt-2.5 text-[0.8125rem] leading-snug text-[#6B7280]">
                    {f.label}
                  </dt>
                </div>
              ))}
            </dl>

            <dl className="mt-14 lg:mt-20 border-t border-[#E7E7EA]">
              {[
                ...G700.specs.details,
                {
                  label: "Овор хэмжээ",
                  value: `${G700.specs.dimensions.length.replace(" мм", "")} × ${G700.specs.dimensions.width.replace(" мм", "")} × ${G700.specs.dimensions.height}`,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 py-4 border-b border-[#E7E7EA]"
                >
                  <dt className="text-sm text-[#6B7280]">{row.label}</dt>
                  <dd className="text-sm lg:text-[0.9375rem] font-semibold text-[#17181B] text-right">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <a
                href="#order"
                className="btn-electric-jetour inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm"
              >
                Урьдчилсан захиалга
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Урьдчилсан захиалга ── */}
        <OrderForm />

        <Footer />
      </div>
    </>
  );
}
