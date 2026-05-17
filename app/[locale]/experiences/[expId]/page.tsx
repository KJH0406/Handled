import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { experiencesRepo } from "../../../lib/repositories/experiences"
import { guidesRepo } from "../../../lib/repositories/guides"
import ExperienceDetailScreen from "../../../screens/ExperienceDetailScreen"

interface PageProps {
  params: { locale: string; expId: string }
}

export async function generateMetadata({
  params: { locale, expId },
}: PageProps): Promise<Metadata> {
  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const tSite = await getTranslations({ locale, namespace: "site" })
  const exp = experiencesRepo.findById(expId)
  if (!exp) {
    return { title: tMeta("experienceNotFound") }
  }
  const guide = guidesRepo.findById(exp.guideId)
  const title = guide
    ? tMeta("experienceTitle", { title: exp.title, host: guide.name })
    : tMeta("experienceTitleNoHost", { title: exp.title })
  const url = `/experiences/${exp.id}`
  return {
    title,
    description: exp.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · ${tSite("name")}`,
      description: exp.summary,
      url,
      images: [{ url: exp.photo, width: 1200, height: 750, alt: exp.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${tSite("name")}`,
      description: exp.summary,
      images: [exp.photo],
    },
  }
}

export default function Page({ params }: PageProps) {
  return <ExperienceDetailScreen expId={params.expId} />
}
