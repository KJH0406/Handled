import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { storiesRepo } from "../../../lib/repositories/stories"
import StoryDetailScreen from "../../../screens/StoryDetailScreen"

interface PageProps {
  params: { locale: string; storyId: string }
}

export async function generateMetadata({
  params: { locale, storyId },
}: PageProps): Promise<Metadata> {
  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const tSite = await getTranslations({ locale, namespace: "site" })
  const story = storiesRepo.findById(storyId)
  if (!story) {
    return { title: tMeta("storyNotFound") }
  }
  const url = `/stories/${story.id}`
  return {
    title: story.title,
    description: story.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${story.title} · ${tSite("name")}`,
      description: story.summary,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.title} · ${tSite("name")}`,
      description: story.summary,
    },
  }
}

export default function Page({ params }: PageProps) {
  return <StoryDetailScreen storyId={params.storyId} />
}
