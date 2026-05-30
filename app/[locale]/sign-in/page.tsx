import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import SignInScreen from "../../screens/SignInScreen"

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.signIn" })
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/sign-in" },
  }
}

export default function Page() {
  return <SignInScreen />
}
