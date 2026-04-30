import { SITE } from "@/shared/site";
import { Section } from "./Section";

const PLACEHOLDER = "준비 중";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <Section className="py-14 sm:py-16">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-base font-bold tracking-tight text-ink">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-accent"
                aria-hidden
              />
              <span>{SITE.brand}</span>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
              매일 보는 검색광고 운영. 구글·네이버 검색광고 전문 대행.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
            <FooterBlock title="사업자 정보">
              <Row label="상호" value={SITE.legalName} />
              <Row label="대표자" value={SITE.ceo} />
              <Row
                label="사업자등록번호"
                value={SITE.bizNumber || PLACEHOLDER}
              />
              <Row
                label="통신판매업 신고"
                value={SITE.mailOrderNumber || PLACEHOLDER}
              />
              <Row label="주소" value={SITE.address || PLACEHOLDER} />
            </FooterBlock>

            <FooterBlock title="문의">
              {SITE.phone ? (
                <Row
                  label="전화"
                  value={SITE.phone}
                  href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}
                />
              ) : null}
              <Row
                label="이메일"
                value={SITE.email}
                href={`mailto:${SITE.email}`}
              />
              <Row
                label="카카오 채널"
                value={`@${SITE.brand}`}
                href={SITE.kakaoChannel}
              />
              <Row label="도메인" value={SITE.domain} />
            </FooterBlock>

            <FooterBlock title="약관">
              <a
                href="/privacy"
                className="text-sm font-medium text-ink-muted hover:text-ink"
              >
                개인정보처리방침
              </a>
              <a
                href="/terms"
                className="text-sm font-medium text-ink-muted hover:text-ink"
              >
                이용약관
              </a>
            </FooterBlock>
          </div>

          <div className="flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
            </p>
            <p>공정거래위원회 표시·광고법, 의료광고법 등 관련 법규를 준수합니다.</p>
          </div>
        </div>
      </Section>
    </footer>
  );
}

function FooterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
        {title}
      </h4>
      <div className="flex flex-col gap-2 text-sm">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-ink hover:text-accent"
    >
      {value}
    </a>
  ) : (
    <span className="text-ink">{value}</span>
  );
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3 text-sm">
      <span className="text-ink-subtle">{label}</span>
      <span className="break-all">{content}</span>
    </div>
  );
}
