import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import SignUpScreen from "../../screens/SignUpScreen"

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.signUp" })
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/sign-up" },
  }
}

export default function Page() {
  return <SignUpScreen />
}
