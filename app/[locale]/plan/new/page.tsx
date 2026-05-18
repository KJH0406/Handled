import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import PlanNewScreen from "../../../screens/PlanNewScreen"

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.planNew" })
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/plan/new" },
  }
}

export default function Page() {
  return <PlanNewScreen />
}
