import type { Metadata } from "next"
import { experiencesRepo } from "../../lib/repositories/experiences"
import { guidesRepo } from "../../lib/repositories/guides"
import ExperienceDetailScreen from "../../screens/ExperienceDetailScreen"

interface PageProps {
  params: { expId: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const exp = experiencesRepo.findById(params.expId)
  if (!exp) {
    return { title: "Experience not found" }
  }
  const guide = guidesRepo.findById(exp.guideId)
  const hostSuffix = guide ? ` — ${guide.name}` : ""
  const title = `${exp.title}${hostSuffix}`
  const url = `/experiences/${exp.id}`
  return {
    title,
    description: exp.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · Handled`,
      description: exp.summary,
      url,
      images: [{ url: exp.photo, width: 1200, height: 750, alt: exp.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Handled`,
      description: exp.summary,
      images: [exp.photo],
    },
  }
}

export default function Page({ params }: PageProps) {
  return <ExperienceDetailScreen expId={params.expId} />
}
