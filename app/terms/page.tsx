import type { Metadata } from "next";
import { SITE } from "@/shared/site";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "이용약관",
  description: `${SITE.brand} 광고 운영 서비스 이용약관.`,
};

export default function TermsPage() {
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
              이용약관
            </h1>
            <p className="text-sm text-ink-subtle">
              시행일: 2026-04-28 · 운영: {SITE.legalName}
            </p>

            <Article title="제1조 (목적)">
              <p>
                본 약관은 {SITE.legalName}({SITE.brand}, 이하 &quot;회사&quot;)이
                제공하는 검색광고 운영 대행 서비스(이하 &quot;서비스&quot;)의
                이용 조건과 절차, 회사와 광고주의 권리·의무 및 책임 사항을
                규정함을 목적으로 합니다.
              </p>
            </Article>

            <Article title="제2조 (서비스의 범위)">
              <ul>
                <li>구글·네이버 등 검색광고 운영 대행</li>
                <li>매일 검색어 리포트 분석 및 부정 키워드 차단</li>
                <li>광고주 전용 24시간 대시보드 제공</li>
                <li>주간/월간 정기 보고서 및 인사이트 발송</li>
              </ul>
            </Article>

            <Article title="제3조 (계약의 성립)">
              <p>
                광고주가 카카오톡 채널 또는 이메일을 통해 상담을 신청하고, 회사가
                제공하는 견적·운영 조건을 광고주가 확인·동의함으로써 계약이
                성립합니다.
              </p>
            </Article>

            <Article title="제4조 (대금 및 지급)">
              <p>
                서비스 대금은 월 단위 후불 또는 사전 협의된 방식으로 청구하며,
                광고 매체비(구글/네이버 등)는 광고주가 직접 매체사에 결제하는
                것을 원칙으로 합니다.
              </p>
            </Article>

            <Article title="제5조 (회사의 의무)">
              <ul>
                <li>광고 운영 데이터를 광고주 전용 대시보드를 통해 24시간 투명하게 공개</li>
                <li>매일 검색어 리포트 분석 및 낭비 키워드 즉시 차단</li>
                <li>광고주의 사전 동의 없이 광고 예산을 임의로 증액하지 않음</li>
                <li>&quot;매출 보장&quot; 등 부풀림 표현 사용 금지</li>
              </ul>
            </Article>

            <Article title="제6조 (광고주의 의무)">
              <ul>
                <li>광고 매체 계정 접근에 필요한 권한 부여</li>
                <li>광고 콘텐츠 및 랜딩페이지의 적법성 확인</li>
                <li>광고 매체비의 적시 결제</li>
              </ul>
            </Article>

            <Article title="제7조 (해지)">
              <p>
                광고주와 회사 모두 사전 통지 후 언제든 계약을 해지할 수
                있습니다. 장기 약정으로 묶지 않습니다.
              </p>
            </Article>

            <Article title="제8조 (책임의 한계)">
              <p>
                회사는 광고 매체사 정책 변경, 광고 시스템 장애 등 회사의 통제
                범위를 벗어난 사유로 발생한 손해에 대해 책임을 지지 않습니다.
              </p>
            </Article>

            <Article title="제9조 (분쟁 해결)">
              <p>
                본 약관과 관련된 분쟁은 대한민국 법령에 따르며, 회사 본점
                소재지 관할 법원을 합의관할 법원으로 합니다.
              </p>
            </Article>

            <p className="text-xs text-ink-subtle">
              본 약관은 광고주에게 사전 공지 후 변경될 수 있습니다.
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
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink-muted sm:text-base [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
