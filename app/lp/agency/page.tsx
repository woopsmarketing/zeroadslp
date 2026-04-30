import type { Metadata } from "next";
import {
  AGENCY_HEADLINE,
  AGENCY_ACCENT_WORDS,
  AGENCY_SUBHEAD,
  INTENT_PROBLEM,
  detectChannel,
  detectIntent,
  channelToDesignChannel,
  channelEyebrow,
  channelToChipLabel,
} from "@/content/channels";
import { sharedContent } from "@/content/shared";
import { SITE } from "@/shared/site";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { OpsBoardSection } from "@/components/OpsBoardSection";
import { PainPoints } from "@/components/PainPoints";
import { DiagnosisReportSample } from "@/components/DiagnosisReportSample";
import { ServicesFlow } from "@/components/ServicesFlow";
import { CaseStudies } from "@/components/CaseStudies";
import { ChannelChips } from "@/components/Chips";
import { FAQ } from "@/components/FAQ";
import { PreFormCta } from "@/components/PreFormCta";
import { Footer } from "@/components/Footer";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { VariantViewTracker } from "@/components/VariantViewTracker";
import { JsonLd } from "@/components/JsonLd";

type SearchParams = Promise<{
  ch?: string | string[];
  intent?: string | string[];
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
  // legacy
  kw?: string | string[];
}>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeroads.kr";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const channel = detectChannel(sp.utm_term ?? sp.kw, sp.ch);
  const intent = detectIntent(sp.intent);
  const headline = intent === "problem" ? INTENT_PROBLEM.headline : AGENCY_HEADLINE;
  const subhead = intent === "problem" ? INTENT_PROBLEM.subhead : AGENCY_SUBHEAD;
  return {
    title: headline,
    description: subhead,
    openGraph: { title: headline, description: subhead },
    twitter: { title: headline, description: subhead },
    alternates: {
      // canonical 은 본 LP 의 base 경로 (intent/ch 변형은 색인 분리 안 함)
      canonical: `${SITE_URL}/lp/agency`,
    },
  };
}

export default async function AgencyLp({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const channel = detectChannel(sp.utm_term ?? sp.kw, sp.ch);
  const intent = detectIntent(sp.intent);

  const designChannel = channelToDesignChannel(channel);
  const variantKey = intent ? `agency_${channel}_${intent}` : `agency_${channel}`;
  const variantRef = variantKey;

  const headline = intent === "problem" ? INTENT_PROBLEM.headline : AGENCY_HEADLINE;
  const accentWords =
    intent === "problem" ? INTENT_PROBLEM.accentWords : AGENCY_ACCENT_WORDS;
  const subhead = intent === "problem" ? INTENT_PROBLEM.subhead : AGENCY_SUBHEAD;

  const faqItems = sharedContent.commonFAQs;

  return (
    <div data-channel={designChannel}>
      <VariantViewTracker variantRef={variantRef} variantKey={variantKey} />
      <main className="pb-24 md:pb-0">
        <Hero
          eyebrow={channelEyebrow(channel)}
          headline={headline}
          accentWords={accentWords}
          subhead={subhead}
          ctaPrimary={{ label: "카톡으로 진단 받기", href: SITE.kakaoChannel }}
          variantRef={variantRef}
          variantKey={variantKey}
        />
        <TrustBar />
        <PainPoints />
        <DiagnosisReportSample />
        <ServicesFlow />
        <OpsBoardSection />
        <CaseStudies />
        <ChannelChips
          items={sharedContent.channelChips}
          active={channelToChipLabel(channel)}
        />
        <FAQ items={faqItems} />
        <PreFormCta />
      </main>
      <Footer />
      <StickyMobileCta
        variantRef={variantRef}
        variantKey={variantKey}
        label="카톡으로 진단"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "광고대행 — 통합 운영",
          provider: {
            "@type": "Organization",
            name: "제로애드",
            url: SITE_URL,
          },
          areaServed: { "@type": "Country", name: "KR" },
          serviceType: "광고대행",
          description: AGENCY_SUBHEAD,
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
