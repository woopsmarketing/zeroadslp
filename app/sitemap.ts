import type { MetadataRoute } from "next";
import { CATEGORY_SLUGS } from "@/content/categories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeroads.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const lpIndustry = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/lp/industry/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...lpIndustry,
    {
      url: `${SITE_URL}/lp/agency`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
