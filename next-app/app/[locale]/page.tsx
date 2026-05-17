import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import HomeScreen from "../screens/HomeScreen"

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.home" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: { canonical: "/" },
  }
}

export default function Page() {
  return <HomeScreen />
}
