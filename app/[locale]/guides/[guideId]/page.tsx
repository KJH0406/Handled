import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { guidesRepo } from "../../../lib/repositories/guides"
import ProfileScreen from "../../../screens/ProfileScreen"

interface PageProps {
  params: { locale: string; guideId: string }
}

export async function generateMetadata({
  params: { locale, guideId },
}: PageProps): Promise<Metadata> {
  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const tSite = await getTranslations({ locale, namespace: "site" })
  const guide = guidesRepo.findById(guideId)
  if (!guide) {
    return { title: tMeta("guideNotFound") }
  }
  const title = tMeta("guideTitle", { name: guide.name, city: guide.city })
  const url = `/guides/${guide.id}`
  return {
    title,
    description: guide.oneLiner,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} - ${tSite("name")}`,
      description: guide.oneLiner,
      url,
      images: [{ url: guide.photo, width: 800, height: 800, alt: guide.name }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${tSite("name")}`,
      description: guide.oneLiner,
      images: [guide.photo],
    },
  }
}

export default function Page({ params }: PageProps) {
  return <ProfileScreen guideId={params.guideId} />
}
