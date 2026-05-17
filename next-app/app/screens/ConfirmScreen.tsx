"use client"

import { useTranslations } from "next-intl"
import { useBooking } from "../components/booking/BookingProvider"
import Avatar from "../components/ui/Avatar"
import Icon from "../components/ui/Icon"
import SummaryRow from "../components/ui/SummaryRow"
import { formatDate, usd } from "../lib/format"
import { useAppNavigate } from "../lib/navigation"

export default function ConfirmScreen() {
  const t = useTranslations("confirm")
  const navigate = useAppNavigate()
  const { booking, hydrated } = useBooking()

  if (!hydrated) {
    return <main className="fade-in" />
  }

  if (!booking) {
    return (
      <main className="fade-in">
        <div className="container empty-state">
          <p className="t-body-md muted">{t("empty.title")}</p>
          <button
            className="btn btn-secondary mt-base"
            onClick={() => navigate("home")}
          >
            {t("empty.cta")}
          </button>
        </div>
      </main>
    )
  }

  const { guide } = booking

  return (
    <main className="fade-in">
      <div className="container confirm-container">
        <div className="confirm-stack">
          <div className="icon-circle icon-circle--xl confirm-check">
            <Icon name="check" size={44} stroke="white" sw={3} />
          </div>

          <h1 className="t-display-xl ink mb-md">{t("title")}</h1>
          <p className="t-body-md muted mb-xl confirm-subtitle">
            {t("subtitle", { name: guide.name })}
          </p>

          <div className="confirm-summary-card">
            <div className="row row-gap-md confirm-host-row">
              <Avatar
                src={guide.photo}
                alt={guide.name}
                name={guide.name}
                size={56}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-caption muted">{t("host")}</div>
                <div className="t-title-md ink">{guide.name}</div>
                <div className="t-caption-sm muted">
                  {guide.district}, {guide.city}
                </div>
              </div>
              <span
                className="badge-pill badge-pill--accent"
                style={{ flexShrink: 0 }}
              >
                {booking.experience ? t("typeExperience") : t("typeCustom")}
              </span>
            </div>

            <div className="divider confirm-divider" />

            <div className="stack-md">
              {booking.experience && (
                <SummaryRow
                  icon="sparkles"
                  label={t("experience")}
                  value={booking.experience.title}
                />
              )}
              <SummaryRow
                icon="calendar"
                label={t("date")}
                value={formatDate(booking.date)}
              />
              <SummaryRow
                icon="clock"
                label={t("time")}
                value={t("timeValue", {
                  time: booking.time,
                  hours: booking.hours,
                })}
              />
              <SummaryRow
                icon="users"
                label={t("guests")}
                value={t("guestsValue", { count: booking.guests })}
              />
              {booking.interests && booking.interests.length > 0 && (
                <SummaryRow
                  icon="award"
                  label={t("interests")}
                  value={booking.interests.join(" · ")}
                />
              )}
              {booking.requests && (
                <SummaryRow
                  icon="message"
                  label={t("specialRequests")}
                  value={booking.requests}
                />
              )}
              <SummaryRow
                icon="lock"
                label={t("payment")}
                value={t("paymentValue", {
                  amount: usd(booking.total),
                  last4: booking.cardLast4 ?? "****",
                })}
              />
              <SummaryRow
                icon="shield"
                label={t("bookingId")}
                value={booking.bookingId ?? "HD-XXXXXX"}
              />
            </div>
          </div>

          <div className="row row-gap-sm confirm-receipt mb-xl">
            <Icon name="mail" size={18} stroke="var(--ink)" />
            <span className="t-body-sm body">{t("emailReceipt")}</span>
          </div>

          <button
            className="btn btn-primary confirm-cta"
            onClick={() => navigate("home")}
          >
            {t("backHome")}
          </button>
          <div className="mt-md">
            <button
              className="btn-tertiary t-body-sm link-inline"
              onClick={() => navigate("list")}
            >
              {t("browseMore")}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
