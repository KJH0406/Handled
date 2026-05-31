"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import {
  addConsultation,
  hasConsultation,
} from "../../lib/booking/consultations"
import { usd } from "../../lib/format"
import type { Experience } from "../../lib/types/domain"
import AuthRequiredModal from "../auth/AuthRequiredModal"
import { useAuth } from "../auth/AuthProvider"
import Portal from "../ui/Portal"

export interface ExpNotifyPanelProps {
  exp: Experience
}

/**
 * Pre-launch panel for the experience detail page. Booking is not open yet, so
 * instead of a reservation we collect a *manual consultation request*: a guide
 * follows up by email. Logged-out visitors are sent through login first; the
 * request is stored per user+experience so a repeat visit shows "already
 * applied". Shares the sticky `.reservation` shell.
 *
 * NOTE: requests are only persisted in the visitor's browser (localStorage) —
 * see lib/booking/consultations for the real-sink follow-up.
 */
export default function ExpNotifyPanel({ exp }: ExpNotifyPanelProps) {
  const t = useTranslations("booking.notify")
  const { user, hydrated } = useAuth()
  const [applied, setApplied] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  useEffect(() => {
    if (!hydrated) return
    setApplied(user ? hasConsultation(user.email, exp.id) : false)
  }, [hydrated, user, exp.id])

  const submit = () => {
    if (!user) return
    addConsultation(user.email, exp.id)
    setSentTo(user.email)
    setApplied(true)
    setConfirmOpen(true)
  }

  const onApply = () => {
    // Logged-out visitors authenticate first, then click apply again.
    if (!user) {
      setAuthOpen(true)
      return
    }
    submit()
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

      {applied ? (
        <div className="notify-success" style={{ marginTop: 20 }}>
          <div className="notify-success-icon" aria-hidden="true">
            ✓
          </div>
          <div
            className="t-title-sm"
            style={{ color: "var(--primary)", marginBottom: 4 }}
          >
            {t("appliedTitle")}
          </div>
          <p className="t-body-sm muted">{t("appliedBody")}</p>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-primary btn-block"
          style={{ marginTop: 20 }}
          onClick={onApply}
        >
          {user ? t("ctaLoggedIn") : t("ctaLoggedOut")}
        </button>
      )}

      <p
        className="t-caption-sm muted"
        style={{ textAlign: "center", marginTop: 14 }}
      >
        {t("disclaimer")}
      </p>

      <Portal>
        <AuthRequiredModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onAuthenticated={() => setAuthOpen(false)}
          title={t("authTitle")}
          subtitle={t("authSubtitle")}
          cta={t("authCta")}
        />
      </Portal>

      {confirmOpen && (
        <Portal>
          <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-confirm-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setConfirmOpen(false)
            }}
          >
          <div
            className="modal-card"
            style={{ maxWidth: 400, textAlign: "center" }}
          >
            <div
              aria-hidden
              style={{
                width: 48,
                height: 48,
                margin: "0 auto 12px",
                borderRadius: 999,
                background: "var(--primary)",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              ✓
            </div>
            <h2
              id="consult-confirm-title"
              className="t-title-md ink"
              style={{ marginBottom: 8 }}
            >
              {t("confirmTitle")}
            </h2>
            <p className="t-body-sm muted" style={{ marginBottom: 12 }}>
              {t("confirmBody")}
            </p>
            {sentTo && (
              <div
                className="t-body-sm ink"
                style={{
                  fontWeight: 600,
                  padding: "10px 14px",
                  marginBottom: 20,
                  borderRadius: 10,
                  background: "var(--surface-soft)",
                  wordBreak: "break-all",
                  textAlign: "center",
                }}
              >
                ✉️ {sentTo}
              </div>
            )}
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setConfirmOpen(false)}
            >
              {t("confirmCta")}
            </button>
          </div>
          </div>
        </Portal>
      )}
    </aside>
  )
}
