"use client"

import { useTranslations } from "next-intl"
import { useId, useState } from "react"
import { usd } from "../../lib/format"
import type { Experience } from "../../lib/types/domain"

export interface ExpNotifyPanelProps {
  exp: Experience
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Pre-launch panel for the experience detail page. Booking is not yet open, so
 * instead of the reservation flow we collect an email to notify the visitor at
 * launch. Shares the sticky `.reservation` shell (sticky on desktop, static on
 * mobile). NOTE: the email is not persisted anywhere yet — see ExpBookingPanel
 * for the real reservation flow to restore when the service opens.
 */
export default function ExpNotifyPanel({ exp }: ExpNotifyPanelProps) {
  const t = useTranslations("booking.notify")
  const inputId = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setError(true)
      return
    }
    setError(false)
    setSubmitted(true)
  }

  return (
    <aside className="reservation" id="reservation-panel">
      <div
        className="row"
        style={{ alignItems: "baseline", gap: 4, marginBottom: 20 }}
      >
        <span className="t-display-md ink">{usd(exp.price)}</span>
        <span className="t-body-md muted">{t("perPerson")}</span>
      </div>

      <div className="notify-callout">
        <div className="notify-callout-icon" aria-hidden="true">
          🚀
        </div>
        <div className="t-title-md ink" style={{ marginBottom: 8 }}>
          {t("comingSoonTitle")}
        </div>
        <p className="t-body-sm body">{t("comingSoonBody")}</p>
      </div>

      {submitted ? (
        <div className="notify-success" style={{ marginTop: 20 }}>
          <div className="notify-success-icon" aria-hidden="true">
            ✓
          </div>
          <div
            className="t-title-sm"
            style={{ color: "var(--primary)", marginBottom: 4 }}
          >
            {t("successTitle")}
          </div>
          <p className="t-body-sm muted">{t("successBody")}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ marginTop: 20 }} noValidate>
          <label htmlFor={inputId} className="notify-label">
            {t("label")}
          </label>
          <div className="notify-field">
            <input
              id={inputId}
              type="email"
              className="input"
              placeholder={t("placeholder")}
              value={email}
              aria-invalid={error}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(false)
              }}
            />
            <button type="submit" className="btn btn-primary">
              {t("cta")}
            </button>
          </div>
          {error && (
            <p className="t-caption-sm" style={{ color: "var(--error)" }}>
              {t("invalidEmail")}
            </p>
          )}
        </form>
      )}

      <p
        className="t-caption-sm muted"
        style={{ textAlign: "center", marginTop: 14 }}
      >
        {t("disclaimer")}
      </p>
    </aside>
  )
}
