import type { Metadata } from "next";
import { SITE } from "@/shared/site";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE.brand} 개인정보처리방침 — 수집 항목, 이용 목적, 보관 기간 안내.`,
};

export default function PrivacyPage() {
  return (
    <>
      <main>
        <Section className="py-20 sm:py-28">
          <div className="flex flex-col gap-8">
            <div>
              <a
                href="/"
                className="text-sm text-ink-muted hover:text-ink"
              >
                ← 홈으로
              </a>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              개인정보처리방침
            </h1>
            <p className="text-sm text-ink-subtle">
              시행일: 2026-04-28 · 운영: {SITE.legalName}
            </p>

            <Article title="1. 수집하는 개인정보 항목">
              <p>
                {SITE.brand}은(는) 카카오톡 채널 상담 신청 과정에서 다음 정보를
                수집합니다.
              </p>
              <ul>
                <li>필수: 카카오톡 채널 식별값, 상호/사업자명, 연락 가능한 연락처</li>
                <li>선택: 현재 운영 중인 광고 채널, 월 광고비 규모, 광고 목표</li>
              </ul>
            </Article>

            <Article title="2. 개인정보의 수집 및 이용 목적">
              <ul>
                <li>광고 운영 상담 및 견적 제공</li>
                <li>계약 체결 및 광고 운영 서비스 제공</li>
                <li>광고주 전용 대시보드 계정 발급 및 응대</li>
              </ul>
            </Article>

            <Article title="3. 개인정보의 보유 및 이용 기간">
              <p>
                상담 종료 후 1년간 보관 후 파기합니다. 계약이 체결된 경우
                관련 법령(전자상거래법, 국세기본법 등)이 정한 기간 동안 보관
                후 파기합니다.
              </p>
            </Article>

            <Article title="4. 제3자 제공 / 처리 위탁">
              <p>
                광고 운영을 위해 구글(Google Ads), 네이버(NAVER 검색광고) 등
                광고 매체사와의 광고주 계정 연동이 필요할 수 있으며, 이 경우
                광고주의 명시적 동의를 받아 진행합니다. 그 외 제3자 제공은
                하지 않습니다.
              </p>
            </Article>

            <Article title="5. 정보주체의 권리">
              <p>
                정보주체는 언제든지 본인의 개인정보 열람, 정정, 삭제, 처리
                정지를 요청할 수 있습니다. 요청은{" "}
                <a className="text-accent underline" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
                로 전달해 주십시오.
              </p>
            </Article>

            <Article title="6. 개인정보 보호 책임자">
              <ul>
                <li>책임자: {SITE.ceo}</li>
                <li>이메일: {SITE.email}</li>
              </ul>
            </Article>

            <p className="text-xs text-ink-subtle">
              본 방침은 법령 변경 또는 운영 정책의 변경에 따라 사전 공지 후
              변경될 수 있습니다.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Article({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 border-t border-line pt-6">
      <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
      <div className="prose-zeroads flex flex-col gap-2 text-sm leading-relaxed text-ink-muted sm:text-base [&_a]:text-accent [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
