import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import MyPlansScreen from "../../screens/MyPlansScreen"

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.myPlans" })
  return {
    title: t("title"),
  }
}

export default function Page() {
  return <MyPlansScreen />
}
