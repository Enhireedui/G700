import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { G700 } from "@/lib/g700";
import { BLUR_DATA_URL } from "@/lib/image";
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

        {/* ── Үндсэн үзүүлэлтүүд ── */}
        <section id="specs" className="section-pad bg-[#F5F5F6] scroll-mt-16">
          <div className="container-page">
            <h2 className="type-h2 text-[#17181B] mb-10">Үндсэн үзүүлэлтүүд</h2>

            {/* Гол тоонууд — том, богино гарчигтай (premium брэндийн маяг) */}
            <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#E7E7EA] rounded-2xl overflow-hidden border border-[#E7E7EA]">
              {G700.specs.figures.map((f) => (
                <div key={f.label} className="bg-white p-5 lg:p-6">
                  <dd className="font-extrabold tracking-tight text-[#17181B] text-xl lg:text-[1.75rem] leading-none">
                    {f.value}
                  </dd>
                  <dt className="mt-2 text-[0.8125rem] leading-snug text-[#6B7280]">{f.label}</dt>
                </div>
              ))}
            </dl>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mt-10 lg:mt-14">
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-[#E7E7EA]">
                  <Image
                    src={G700.specs.image}
                    alt={G700.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Урт", value: G700.specs.dimensions.length },
                    { label: "Өргөн", value: G700.specs.dimensions.width },
                    { label: "Өндөр", value: G700.specs.dimensions.height },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="rounded-xl border border-[#E7E7EA] bg-white py-4 text-center"
                    >
                      <p className="text-[0.65rem] tracking-[0.16em] uppercase text-[#6B7280] mb-1">
                        {d.label}
                      </p>
                      <p className="font-bold text-base lg:text-lg text-[#17181B]">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <dl className="divide-y divide-[#E7E7EA] border-y border-[#E7E7EA]">
                  {G700.specs.details.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-6 py-3.5"
                    >
                      <dt className="text-sm text-[#54585F]">{row.label}</dt>
                      <dd className="font-bold text-sm lg:text-base text-[#17181B] text-right shrink-0">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="pt-7">
                  <a
                    href="#order"
                    className="btn-electric-jetour inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm"
                  >
                    Урьдчилсан захиалга
                    <ArrowDown className="w-4 h-4" />
                  </a>
                </div>
              </div>
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
