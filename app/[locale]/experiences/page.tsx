import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import ExperiencesScreen from "../../screens/ExperiencesScreen"

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "metadata.experiences",
  })
  const tSite = await getTranslations({ locale, namespace: "site" })
  const title = t("title")
  const description = t("description")
  return {
    title,
    description,
    alternates: { canonical: "/experiences" },
    openGraph: {
      title: `${title} - ${tSite("name")}`,
      description,
      url: "/experiences",
    },
  }
}

export default function Page() {
  return (
    <Suspense fallback={<main className="fade-in" />}>
      <ExperiencesScreen />
    </Suspense>
  )
}
