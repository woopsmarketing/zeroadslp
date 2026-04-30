import type { Metadata } from "next";
import { SITE } from "@/shared/site";
import { sharedContent } from "@/content/shared";
import { categoryContent, CATEGORY_SLUGS } from "@/content/categories";
import { Section, SectionEyebrow } from "@/components/Section";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { OpsBoardSection } from "@/components/OpsBoardSection";
import { PainPoints } from "@/components/PainPoints";
import { DiagnosisReportSample } from "@/components/DiagnosisReportSample";
import { ServicesFlow } from "@/components/ServicesFlow";
import { CaseStudies } from "@/components/CaseStudies";
import { FAQ } from "@/components/FAQ";
import { PreFormCta } from "@/components/PreFormCta";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeroads.kr";

export const metadata: Metadata = {
  title: `${SITE.brand} — 광고대행사`,
  description:
    "광고비 새는 구멍을 막고, 매출 전환 구조를 고치는 광고대행사. 광고 진단 + 추적 인프라 + 매주 개선 루프 + 광고주 직접 결제.",
  alternates: { canonical: SITE_URL },
};

const variantKey = "home";
const variantRef = "home";

export default function Home() {
  const industries = CATEGORY_SLUGS.map((slug) => categoryContent[slug]);

  return (
    <div data-channel="mixed">
      <main className="pb-24 md:pb-0">
        <Hero
          eyebrow="제로애드 — 광고대행사"
          headline="광고비 새는 구멍을 찾고, 전환 구조를 고치는 광고 실행팀."
          accentWords={["광고비 새는 구멍을 찾고"]}
          subhead="광고 계정·GA4·GTM·랜딩페이지·문의 흐름까지 진단하고 매주 개선합니다. 운영 현황은 광고주 전용 보드 공유 URL로 매일 직접 확인합니다."
          ctaPrimary={{ label: "카톡으로 진단 받기", href: SITE.kakaoChannel }}
          ctaSecondary={{
            label: "폼으로 신청",
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

        <Section id="lineup" className="bg-bg-soft py-20 sm:py-24">
          <div className="flex flex-col items-center gap-12 text-center">
            <div className="flex flex-col items-center gap-5">
              <SectionEyebrow>서비스 라인업</SectionEyebrow>
              <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
                산업별 · 매체별 — 둘 다 운영합니다.
              </h2>
            </div>

            <div className="grid w-full gap-5 text-left md:grid-cols-2">
              <div className="flex flex-col gap-5 rounded-2xl border border-line bg-bg p-7 sm:p-8">
                <h3 className="text-xl font-bold tracking-tight text-ink">
                  산업별 전문 LP
                </h3>
                <ul className="grid grid-cols-2 gap-2.5">
                  {industries.map((c) => (
                    <li key={c.slug}>
                      <a
                        href={`/lp/industry/${c.slug}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-soft px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent-soft hover:text-accent-deep"
                      >
                        <span>{c.label}</span>
                        <span aria-hidden>→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-5 rounded-2xl border border-line bg-bg p-7 sm:p-8">
                <h3 className="text-xl font-bold tracking-tight text-ink">
                  매체별 통합 운영
                </h3>
                <ul className="flex flex-wrap gap-2.5">
                  {sharedContent.channelChips.map((label) => (
                    <li
                      key={label}
                      className="inline-flex items-center rounded-full border border-line bg-bg-soft px-3.5 py-1.5 text-sm font-semibold text-ink-muted"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
                <a
                  href="/lp/agency"
                  className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  종합 광고대행 보러가기
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </Section>

        <FAQ items={sharedContent.commonFAQs} />
        <PreFormCta />
        <ContactForm
          variantRef={variantRef}
          variantKey={variantKey}
          hidden={{ lp_source: "home" }}
        />
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
          "@type": "Organization",
          name: SITE.brand,
          legalName: SITE.legalName,
          url: SITE_URL,
          email: SITE.email,
          founder: { "@type": "Person", name: SITE.ceo },
          areaServed: { "@type": "Country", name: "KR" },
          sameAs: [SITE.kakaoChannel],
        }}
      />
    </div>
  );
}
