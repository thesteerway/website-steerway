import type { MetadataRoute } from "next";

const BASE = "https://thesteerway.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/what-we-build`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
