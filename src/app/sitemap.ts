import { MetadataRoute } from "next";
import { cities } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://costoflivingindia.com";
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/offer`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${base}/cost-of-living/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Top comparison pairs (most valuable for SEO)
  const topCities = cities.slice(0, 15);
  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < topCities.length; i++) {
    for (let j = i + 1; j < topCities.length; j++) {
      comparisonPages.push({
        url: `${base}/compare/${topCities[i].slug}-vs-${topCities[j].slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...cityPages, ...comparisonPages];
}
