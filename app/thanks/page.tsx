import type { Metadata } from "next";
import { SITE } from "@/shared/site";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { ThanksTracker } from "./ThanksTracker";

export const metadata: Metadata = {
  title: "감사합니다 — 무료 진단 신청 완료",
  description: `${SITE.brand} 무료 진단 신청이 완료되었습니다. 영업일 기준 24시간 내 답변드립니다.`,
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ lead_id?: string }>;

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const leadId = sp.lead_id ?? "";

  return (
    <>
      <ThanksTracker leadId={leadId} />
      <main>
        <Section className="pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="flex flex-col items-center gap-7 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8"
                aria-hidden
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
              신청이 접수되었습니다.
            </h1>

            <p className="max-w-xl text-base text-ink-muted sm:text-lg">
              영업일 기준 24시간 내에{" "}
              <span className="font-bold text-ink">담당자가 직접 연락</span>
              드립니다. 더 빠른 상담은 카카오 채널을 이용해 주세요.
            </p>

            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="https://pf.kakao.com/_RWCTX/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-bold tracking-tight text-white transition hover:bg-accent-hover"
              >
                카카오톡 1:1 채팅 시작
              </a>
              <a
                href="/"
                className="text-sm font-medium text-ink-muted hover:text-ink"
              >
                ← 홈으로
              </a>
            </div>

            {leadId ? (
              <p className="mt-8 text-xs text-ink-subtle">
                접수 번호: {leadId}
              </p>
            ) : null}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
