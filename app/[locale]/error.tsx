"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useEffect } from "react"
import Icon from "../components/ui/Icon"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const t = useTranslations("error")
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <main className="fade-in">
      <div className="container status-page">
        <div className="status-page__icon">
          <Icon name="x" size={32} stroke="var(--primary)" sw={2.5} />
        </div>
        <h1 className="t-display-md ink mb-base">{t("title")}</h1>
        <p className="t-body-md muted">{t("subtitle")}</p>
        <div className="status-page__actions">
          <button className="btn btn-primary" onClick={() => reset()}>
            {t("tryAgain")}
          </button>
          <Link className="btn btn-secondary" href="/">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  )
}
