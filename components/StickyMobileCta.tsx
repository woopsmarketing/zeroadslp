import { SITE } from "@/shared/site";
import { KakaoCta } from "./KakaoCta";
import { PhoneCta } from "./PhoneCta";

type Props = {
  variantRef: string;
  variantKey: string;
  /** 카톡 primary 라벨 (LP 마다 카피 다름) */
  label: string;
};

/**
 * 모바일 하단 고정 CTA.
 * 카톡 100% (폼 제거 정책). phone env 있으면 사이에 전화 아이콘 추가.
 */
export function StickyMobileCta({ variantRef, variantKey, label }: Props) {
  const hasPhone = !!SITE.phone;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)] backdrop-blur md:hidden">
      <div className="flex items-stretch gap-2">
        <KakaoCta
          href={SITE.kakaoChannel}
          variantRef={variantRef}
          variantKey={variantKey}
          placement="sticky_mobile_kakao"
          label={label}
          tone="primary"
          size="sm"
          className="flex-1 !h-11 !px-4 !text-sm"
        />

        {hasPhone ? (
          <PhoneCta
            phone={SITE.phone}
            variantRef={variantRef}
            variantKey={variantKey}
            iconOnly
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line bg-bg text-ink-muted transition hover:border-ink hover:text-ink"
          />
        ) : null}
      </div>
    </div>
  );
}
