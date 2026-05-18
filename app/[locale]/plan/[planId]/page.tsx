import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

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

export default function Page() {
  return (
    <main className="fade-in">
      <section style={{ padding: "64px 0" }}>
        <div className="container">
          <p className="t-body-sm muted">
            Plan canvas — coming up in ISSUE-18.
          </p>
        </div>
      </section>
    </main>
  )
}
