import Script from "next/script";

/**
 * GTM + GA4 부트스트랩.
 * GTM 컨테이너 ID 가 있으면 GTM 통합 모드 (GA4/Google Ads/네이버 NAS 모두 GTM 에서 관리).
 * GTM 이 없고 GA4 ID 만 있으면 gtag 직접 모드 (개발/초기 단계용).
 * 둘 다 없으면 no-op.
 */
export function TrackingBootstrap() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  if (gtmId) {
    return (
      <>
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      </>
    );
  }

  if (ga4Id) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${ga4Id}', { send_page_view: true });
          `}
        </Script>
      </>
    );
  }

  return null;
}

/**
 * GTM noscript 폴백 (자바스크립트 비활성 환경).
 * `<body>` 직후에 배치.
 */
export function TrackingNoscript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="gtm-noscript"
      />
    </noscript>
  );
}
