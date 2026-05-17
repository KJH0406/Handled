import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import type { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
  params: { locale: string }
}

export async function generateMetadata({
  params: { locale },
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.checkout" })
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  }
}

export default function CheckoutLayout({ children }: LayoutProps) {
  return children
}
