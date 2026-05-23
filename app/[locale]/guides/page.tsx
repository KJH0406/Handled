import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import ListScreen from "../../screens/ListScreen"

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.guides" })
  const tSite = await getTranslations({ locale, namespace: "site" })
  const title = t("title")
  const description = t("description")
  return {
    title,
    description,
    alternates: { canonical: "/guides" },
    openGraph: {
      title: `${title} - ${tSite("name")}`,
      description,
      url: "/guides",
    },
  }
}

export default function Page() {
  return (
    <Suspense fallback={<main className="fade-in" />}>
      <ListScreen />
    </Suspense>
  )
}
