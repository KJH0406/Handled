import type { MetadataRoute } from "next"
import { experiencesRepo } from "./lib/repositories/experiences"
import { guidesRepo } from "./lib/repositories/guides"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/guides`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/experiences`, lastModified: now, priority: 0.8 },
  ]
  const guideEntries: MetadataRoute.Sitemap = guidesRepo.list().map((g) => ({
    url: `${SITE_URL}/guides/${g.id}`,
    lastModified: now,
    priority: 0.6,
  }))
  const expEntries: MetadataRoute.Sitemap = experiencesRepo.list().map((e) => ({
    url: `${SITE_URL}/experiences/${e.id}`,
    lastModified: now,
    priority: 0.6,
  }))
  return [...staticEntries, ...guideEntries, ...expEntries]
}
