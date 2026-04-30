/**
 * LP-A 산업별 콘텐츠 — 단일 진실원.
 *
 * 정책: 사례·KPI 수치는 60일 운영 후 공개. 그 전까지는 무료 진단/체크리스트 중심.
 * (general.md 가이드라인 — 거짓 사례처럼 보이면 신뢰가 떨어짐)
 */
import type { FaqItem } from "./shared";

export type CategoryContent = {
  slug: string;
  label: string;
  hero: {
    headlineTemplate: (loc: string) => string;
    /** 헤드라인 내 강조할 단어 — highlightHeadline 에 전달 */
    accentWordsTemplate?: (loc: string) => string[];
    subhead: string;
    ctaPrimary: string;
  };
  industryFAQs: FaqItem[];
  primaryKeywords: string[];
};

export const categoryContent: Record<string, CategoryContent> = {
  dental: {
    slug: "dental",
    label: "치과마케팅",
    hero: {
      headlineTemplate: (loc) =>
        loc ? `${loc} 치과 마케팅 — 제로애드` : "치과 마케팅 전문 — 제로애드",
      accentWordsTemplate: (loc) =>
        loc ? [`${loc} 치과 마케팅`] : ["치과 마케팅"],
      subhead:
        "치과 광고 계정·랜딩·문의 흐름을 진단하고, 신환 전환 구조까지 매주 개선합니다. 운영 현황은 광고주 전용 보드로 매일 공유합니다.",
      ctaPrimary: "카톡으로 진단 받기",
    },
    industryFAQs: [
      {
        q: "의료광고 사전심의는 어떻게 처리하나요?",
        a: "대한치과의사협회 의료광고심의위원회 사전심의를 자체 처리합니다. 평균 5~7 영업일.",
      },
      {
        q: "치과 광고에서 가장 효과적인 매체는?",
        a: "치과는 네이버 파워링크 + 블로그체험단 + 구글 검색이 평균적으로 ROAS가 높게 나타납니다. 다만 의원별 입지·진료과목에 따라 달라지므로 진단 후 매체 비중을 설계합니다.",
      },
    ],
    primaryKeywords: ["치과마케팅", "임플란트마케팅", "교정마케팅"],
  },

  clinic: {
    slug: "clinic",
    label: "병원마케팅",
    hero: {
      headlineTemplate: (loc) =>
        loc ? `${loc} 병원 마케팅 — 제로애드` : "병원 마케팅 전문 — 제로애드",
      accentWordsTemplate: (loc) =>
        loc ? [`${loc} 병원 마케팅`] : ["병원 마케팅"],
      subhead:
        "병원 광고 계정·랜딩·예약 흐름을 진단하고, 진료과별 환자 전환 구조를 매주 개선합니다. 운영 현황은 광고주 전용 보드로 매일 공유합니다.",
      ctaPrimary: "카톡으로 진단 받기",
    },
    industryFAQs: [
      {
        q: "진료과별로 광고 전략이 다른가요?",
        a: "내과/이비인후과/소아과는 지역 네이버 위주, 피부과/성형외과는 인스타그램 + 블로그 위주로 운영하는 패턴이 일반적입니다. 의원 위치·환자층에 따라 비중을 조정합니다.",
      },
    ],
    primaryKeywords: [
      "병원마케팅",
      "의원마케팅",
      "한의원마케팅",
      "피부과마케팅",
      "정형외과마케팅",
    ],
  },

  interior: {
    slug: "interior",
    label: "인테리어마케팅",
    hero: {
      headlineTemplate: (loc) =>
        loc
          ? `${loc} 인테리어 마케팅 — 제로애드`
          : "인테리어 마케팅 전문 — 제로애드",
      accentWordsTemplate: (loc) =>
        loc ? [`${loc} 인테리어 마케팅`] : ["인테리어 마케팅"],
      subhead:
        "인테리어 광고 계정·랜딩·견적 문의 흐름을 진단하고, 전환 구조를 매주 개선합니다. 운영 현황은 광고주 전용 보드로 매일 확인합니다.",
      // 소상공인/로컬 톤 — 직관적 표현
      ctaPrimary: "카톡으로 진단 받기",
    },
    industryFAQs: [
      {
        q: "시공 BeforeAfter 사진을 광고에 어떻게 활용하나요?",
        a: "인스타그램 캐러셀 + 네이버 블로그 체험단 + 구글 디스플레이까지 통합 활용합니다. 시공 사례 사진은 광고주의 권리 동의 후 사용합니다.",
      },
    ],
    primaryKeywords: [
      "인테리어마케팅",
      "리모델링 마케팅",
      "주방 인테리어 마케팅",
    ],
  },

  tax: {
    slug: "tax",
    label: "세무사마케팅",
    hero: {
      headlineTemplate: (loc) =>
        loc
          ? `${loc} 세무사 마케팅 — 제로애드`
          : "세무사 마케팅 전문 — 제로애드",
      accentWordsTemplate: (loc) =>
        loc ? [`${loc} 세무사 마케팅`] : ["세무사 마케팅"],
      subhead:
        "세무사 광고 계정·랜딩·상담 문의 흐름을 진단하고, 신규 거래처 전환 구조를 매주 개선합니다. 운영 현황은 광고주 전용 보드로 매일 확인합니다.",
      // 직관 톤 — 전문직 1인 사무소 대표 향
      ctaPrimary: "카톡으로 진단 받기",
    },
    industryFAQs: [
      {
        q: "세무사 광고는 시즌성이 있나요?",
        a: "5월 종소세 / 1월 부가세 / 3월 법인세 시즌이 가장 효과적입니다. 시즌 2개월 전부터 셋업을 권장합니다.",
      },
    ],
    primaryKeywords: ["세무사마케팅", "세무사 광고", "회계사마케팅"],
  },
};

export type CategorySlug = keyof typeof categoryContent;

export const CATEGORY_SLUGS = Object.keys(
  categoryContent
) as readonly CategorySlug[];
