import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import PlanCanvasScreen from "../../../screens/PlanCanvasScreen"

interface PageProps {
  params: { locale: string; planId: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.plan" })
  return {
    title: t("title"),
  }
}

export default function Page({ params }: PageProps) {
  return <PlanCanvasScreen planId={params.planId} />
}
