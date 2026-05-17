import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import Icon from "../components/ui/Icon"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.notFound")
  return { title: t("title") }
}

export default async function NotFound() {
  const t = await getTranslations("notFound")
  return (
    <main className="fade-in">
      <div className="container status-page">
        <div className="status-page__icon">
          <Icon name="search" size={32} stroke="var(--muted)" />
        </div>
        <h1 className="t-display-md ink mb-base">{t("title")}</h1>
        <p className="t-body-md muted">{t("subtitle")}</p>
        <div className="status-page__actions">
          <Link className="btn btn-primary" href="/">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  )
}
