import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATEGORY_SLUGS,
  categoryContent,
  type CategorySlug,
} from "@/content/categories";
import { sharedContent } from "@/content/shared";
import { fallbackLocation } from "@/constants/location-map";
import { SITE } from "@/shared/site";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { OpsBoardSection } from "@/components/OpsBoardSection";
import { PainPoints } from "@/components/PainPoints";
import { DiagnosisReportSample } from "@/components/DiagnosisReportSample";
import { ServicesFlow } from "@/components/ServicesFlow";
import { CaseStudies } from "@/components/CaseStudies";
import { IndustryChips } from "@/components/Chips";
import { FAQ } from "@/components/FAQ";
import { PreFormCta } from "@/components/PreFormCta";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { VariantViewTracker } from "@/components/VariantViewTracker";
import { JsonLd } from "@/components/JsonLd";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{
  // ValueTrack (Google Ads 표준)
  loc_physical?: string | string[];
  loc_interest?: string | string[];
  matchtype?: string | string[];
  device?: string | string[];
  gclid?: string | string[];
  // UTM 표준
  utm_source?: string | string[];
  utm_medium?: string | string[];
  utm_campaign?: string | string[];
  utm_content?: string | string[];
  utm_term?: string | string[];
  // 호환: 구 파라미터(legacy) — 점진 폐기
  loc?: string | string[];
  kw?: string | string[];
}>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeroads.kr";

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryContent[slug as CategorySlug];
  if (!c) return {};
  const sp = await searchParams;
  // 위치는 loc_physical 우선, 없으면 loc_interest, 그래도 없으면 legacy loc
  const loc = fallbackLocation(sp.loc_physical ?? sp.loc_interest ?? sp.loc);
  const headline = c.hero.headlineTemplate(loc);
  return {
    title: headline,
    description: c.hero.subhead,
    openGraph: { title: headline, description: c.hero.subhead },
    twitter: { title: headline, description: c.hero.subhead },
    alternates: { canonical: `${SITE_URL}/lp/industry/${slug}` },
  };
}

export default async function IndustryLp({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const c = categoryContent[slug as CategorySlug];
  if (!c) notFound();

  const sp = await searchParams;
  // 위치 ID(loc_physical/loc_interest/legacy loc) → location-map.ts 로 한글 변환.
  // 다른 raw URL 파라미터(utm_*/matchtype/device/gclid)는 client collectAuto() 가
  // 폼 제출시 window.location 에서 fresh 캡처하므로 page 단에서 hidden 으로 박을 필요 없음.
  const loc = fallbackLocation(sp.loc_physical ?? sp.loc_interest ?? sp.loc);

  const headline = c.hero.headlineTemplate(loc);
  const accentWords = c.hero.accentWordsTemplate?.(loc);
  const variantKey = `industry_${c.slug}`;
  const variantRef = loc ? `industry_${c.slug}_${loc}` : `industry_${c.slug}`;

  const faqItems = [...c.industryFAQs, ...sharedContent.commonFAQs];

  return (
    <div data-channel="mixed">
      <VariantViewTracker variantRef={variantRef} variantKey={variantKey} />
      <main className="pb-24 md:pb-0">
        <Hero
          eyebrow={c.label}
          headline={headline}
          accentWords={accentWords}
          subhead={c.hero.subhead}
          ctaPrimary={{ label: c.hero.ctaPrimary, href: SITE.kakaoChannel }}
          ctaSecondary={{
            label: c.hero.ctaSecondary,
            href: "#contact",
          }}
          variantRef={variantRef}
          variantKey={variantKey}
        />
        <TrustBar />
        <PainPoints />
        <DiagnosisReportSample />
        <ServicesFlow />
        <OpsBoardSection />
        <CaseStudies />
        <IndustryChips
          items={sharedContent.industryChips}
          active={c.label}
        />
        <FAQ items={faqItems} />
        <PreFormCta />
        <ContactForm
          variantRef={variantRef}
          variantKey={variantKey}
          hidden={{
            lp_source: "industry",
            category: c.slug,
            loc,
          }}
        />
      </main>
      <Footer />
      <StickyMobileCta
        variantRef={variantRef}
        variantKey={variantKey}
        label={c.hero.ctaPrimary}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.label,
          provider: {
            "@type": "Organization",
            name: "제로애드",
            url: SITE_URL,
          },
          areaServed: { "@type": "Country", name: "KR" },
          serviceType: "광고대행",
          description: c.hero.subhead,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
