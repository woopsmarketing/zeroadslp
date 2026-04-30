/**
 * 사이트/사업자 정보 — 운영 시점에 채워질 값은 env로 주입.
 * 비워둔 값은 footer에서 "준비 중"으로 표시한다.
 */
export const SITE = {
  brand: "제로애드",
  legalName: "제로버블 솔루션",
  ceo: "박장우",
  email: "vnfm0580@gmail.com",
  domain: "zeroads.kr",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeroads.kr",
  kakaoChannel:
    process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "https://pf.kakao.com/_RWCTX/chat",
  /** tel: 링크용. 비어있으면 phone CTA 자체가 렌더 X. */
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  bizNumber: process.env.NEXT_PUBLIC_BIZ_NUMBER ?? "",
  mailOrderNumber: process.env.NEXT_PUBLIC_MAIL_ORDER_NUMBER ?? "",
  address: process.env.NEXT_PUBLIC_BIZ_ADDRESS ?? "",
} as const;

export const PROMISE_LINE = "어떤 매체든, 어떤 산업이든 — 광고가 잘 되는 대행사";
