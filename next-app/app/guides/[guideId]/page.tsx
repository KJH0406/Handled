import type { Metadata } from "next"
import { guidesRepo } from "../../lib/repositories/guides"
import ProfileScreen from "../../screens/ProfileScreen"

interface PageProps {
  params: { guideId: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = guidesRepo.findById(params.guideId)
  if (!guide) {
    return { title: "Guide not found" }
  }
  const title = `${guide.name} · ${guide.city} guide`
  const url = `/guides/${guide.id}`
  return {
    title,
    description: guide.oneLiner,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — Handled`,
      description: guide.oneLiner,
      url,
      images: [{ url: guide.photo, width: 800, height: 800, alt: guide.name }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Handled`,
      description: guide.oneLiner,
      images: [guide.photo],
    },
  }
}

export default function Page({ params }: PageProps) {
  return <ProfileScreen guideId={params.guideId} />
}
