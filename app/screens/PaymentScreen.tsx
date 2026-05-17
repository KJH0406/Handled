"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"
import { useBooking } from "../components/booking/BookingProvider"
import Breadcrumb from "../components/layout/Breadcrumb"
import Icon from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import { formatDate, usd } from "../lib/format"
import { useAppNavigate } from "../lib/navigation"
import { fmtCard, fmtExp } from "../lib/payments/format"
import { processPayment } from "../lib/payments/mock"
import { validateCard, type CardFieldErrors } from "../lib/payments/validate"

export default function PaymentScreen() {
  const t = useTranslations("payment")
  const tCommon = useTranslations("common")
  const navigate = useAppNavigate()
  const { booking, setBooking, hydrated } = useBooking()
  const [name, setName] = useState("")
  const [card, setCard] = useState("")
  const [exp, setExp] = useState("")
  const [cvc, setCvc] = useState("")
  const [zip, setZip] = useState("")
  const [errs, setErrs] = useState<CardFieldErrors>({})
  const [loading, setLoading] = useState(false)

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

  const submit = async () => {
    const errors = validateCard(
      { name, card, exp, cvc, zip },
      {
        name: t("errors.name"),
        card: t("errors.card"),
        exp: t("errors.exp"),
        cvc: t("errors.cvc"),
        zip: t("errors.zip"),
      },
    )
    if (Object.keys(errors).length > 0) {
      setErrs(errors)
      return
    }
    setErrs({})
    setLoading(true)
    const result = await processPayment({
      amount: booking.total,
      card,
      name,
    })
    setLoading(false)
    setBooking({
      ...booking,
      payerName: result.payerName,
      cardLast4: result.cardLast4,
      bookingId: result.bookingId,
    })
    navigate("confirm")
  }

  return (
    <main className="fade-in">
      <div className="container screen-pad">
        <Breadcrumb
          onBack={() =>
            booking.experience
              ? navigate("experience", { expId: booking.experience.id })
              : navigate("profile", { guideId: guide.id })
          }
        >
          {booking.experience ? t("backToExperience") : t("backToGuide")}
        </Breadcrumb>

        <h1 className="t-display-md ink mb-xl">{t("heading")}</h1>

        <div className="pay-grid">
          <div>
            <div className="mb-xl">
              <h2 className="t-display-sm ink mb-base">
                {t("summary.heading")}
              </h2>
              <div className="stack-md summary-box">
                <div className="row between">
                  <span className="t-body-sm body">{t("summary.type")}</span>
                  <span
                    className="t-body-md value-strong"
                    style={{ color: "var(--rausch)" }}
                  >
                    {booking.experience
                      ? t("summary.typeExperience")
                      : t("summary.typeCustom")}
                  </span>
                </div>
                {booking.experience && (
                  <div
                    className="row between"
                    style={{ alignItems: "flex-start", gap: 16 }}
                  >
                    <span className="t-body-sm body" style={{ flexShrink: 0 }}>
                      {t("summary.experience")}
                    </span>
                    <span
                      className="t-body-md ink"
                      style={{
                        fontWeight: 500,
                        textAlign: "right",
                        flex: 1,
                        minWidth: 0,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {booking.experience.title}
                    </span>
                  </div>
                )}
                <div className="row between">
                  <span className="t-body-sm body">{t("summary.date")}</span>
                  <span className="t-body-md ink value-strong">
                    {formatDate(booking.date)}
                  </span>
                </div>
                <div className="row between">
                  <span className="t-body-sm body">{t("summary.time")}</span>
                  <span className="t-body-md ink value-strong">
                    {t("summary.timeValue", {
                      time: booking.time,
                      hours: booking.hours,
                    })}
                  </span>
                </div>
                <div className="row between">
                  <span className="t-body-sm body">{t("summary.guests")}</span>
                  <span className="t-body-md ink value-strong">
                    {t("summary.guestsValue", { count: booking.guests })}
                  </span>
                </div>
                {booking.interests && booking.interests.length > 0 && (
                  <div
                    className="row between"
                    style={{
                      alignItems: "flex-start",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="t-body-sm body" style={{ flexShrink: 0 }}>
                      {t("summary.interests")}
                    </span>
                    <div
                      className="row"
                      style={{
                        gap: 4,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        flex: 1,
                      }}
                    >
                      {booking.interests.map((i) => (
                        <span key={i} className="tag">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {booking.requests && (
                  <div
                    className="stack-xs"
                    style={{
                      paddingTop: 8,
                      borderTop: "1px solid var(--hairline-soft)",
                    }}
                  >
                    <span className="t-caption muted">
                      {t("summary.specialRequests")}
                    </span>
                    <span className="t-body-sm ink">{booking.requests}</span>
                  </div>
                )}
              </div>
            </div>

            <h2 className="t-display-sm ink mb-base">{t("method.heading")}</h2>
            <div className="stack-base mb-xl">
              <div className="field">
                <label>{t("method.cardholder")}</label>
                <input
                  className={`input ${errs.name ? "error" : ""}`}
                  placeholder={t("method.cardholderPlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errs.name && <span className="help-error">{errs.name}</span>}
              </div>
              <div className="field">
                <label>{t("method.cardNumber")}</label>
                <input
                  className={`input ${errs.card ? "error" : ""}`}
                  placeholder={t("method.cardNumberPlaceholder")}
                  value={card}
                  onChange={(e) => setCard(fmtCard(e.target.value))}
                  inputMode="numeric"
                />
                {errs.card && <span className="help-error">{errs.card}</span>}
              </div>
              <div className="pay-card-row">
                <div className="field">
                  <label>{t("method.expiry")}</label>
                  <input
                    className={`input ${errs.exp ? "error" : ""}`}
                    placeholder={t("method.expiryPlaceholder")}
                    value={exp}
                    onChange={(e) => setExp(fmtExp(e.target.value))}
                    inputMode="numeric"
                  />
                  {errs.exp && <span className="help-error">{errs.exp}</span>}
                </div>
                <div className="field">
                  <label>{t("method.cvc")}</label>
                  <input
                    className={`input ${errs.cvc ? "error" : ""}`}
                    placeholder={t("method.cvcPlaceholder")}
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    inputMode="numeric"
                  />
                  {errs.cvc && <span className="help-error">{errs.cvc}</span>}
                </div>
                <div className="field">
                  <label>{t("method.zip")}</label>
                  <input
                    className={`input ${errs.zip ? "error" : ""}`}
                    placeholder={t("method.zipPlaceholder")}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                  {errs.zip && <span className="help-error">{errs.zip}</span>}
                </div>
              </div>
            </div>

            <h2 className="t-display-sm ink mb-md">{t("policy.heading")}</h2>
            <div className="stack-md summary-box summary-box--soft mb-xl">
              <div className="row row-gap-sm">
                <Icon name="shield" size={18} stroke="var(--ink)" />
                <span className="t-body-sm body">{t("policy.free24h")}</span>
              </div>
              <div className="row row-gap-sm">
                <Icon name="clock" size={18} stroke="var(--ink)" />
                <span className="t-body-sm body">
                  {t("policy.within24h")}
                </span>
              </div>
              <div className="row row-gap-sm">
                <Icon name="lock" size={18} stroke="var(--ink)" />
                <span className="t-body-sm body">{t("policy.ssl")}</span>
              </div>
            </div>

            <p
              className="t-caption-sm muted mb-base"
              style={{ lineHeight: 1.6 }}
            >
              {t.rich("terms", {
                terms: (chunks) => (
                  <span className="link-inline">{chunks}</span>
                ),
                privacy: (chunks) => (
                  <span className="link-inline">{chunks}</span>
                ),
              })}
            </p>

            <button
              className="btn btn-primary btn-block pay-cta"
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> {t("ctaLoading")}
                </>
              ) : (
                t("cta", { amount: usd(booking.total) })
              )}
            </button>
          </div>

          <aside>
            <div className="pay-summary-card">
              <div className="row row-gap-md mb-base">
                <div className="pay-summary-thumb">
                  <Image
                    src={
                      booking.experience
                        ? booking.experience.photo
                        : guide.photo
                    }
                    alt={
                      booking.experience ? booking.experience.title : guide.name
                    }
                    fill
                    sizes="92px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-caption muted">
                    {t("sideCard.guidedBy", {
                      city: guide.city,
                      name: guide.name,
                    })}
                  </div>
                  <div className="t-title-md ink" style={{ marginTop: 2 }}>
                    {booking.experience
                      ? booking.experience.title
                      : t("sideCard.customTourWith", { name: guide.name })}
                  </div>
                  <div className="row row-gap-xs" style={{ marginTop: 4 }}>
                    <Stars rating={guide.rating} />
                    <span className="t-body-sm muted">({guide.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="divider divider--tight" />
              <div className="t-display-sm ink mb-base">
                {t("sideCard.priceDetails")}
              </div>
              <div className="stack-sm mb-base">
                <div className="row between" style={{ gap: 8 }}>
                  <span
                    className="t-body-sm body"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {booking.experience
                      ? t("sideCard.linePerPerson", {
                          amount: usd(booking.experience.price),
                          count: booking.guests,
                        })
                      : t("sideCard.linePerHour", {
                          amount: usd(guide.hourlyRate),
                          hours: booking.hours,
                        })}
                  </span>
                  <span className="t-body-sm ink" style={{ flexShrink: 0 }}>
                    {usd(booking.subtotal)}
                  </span>
                </div>
                <div className="row between">
                  <span className="t-body-sm body">
                    {t("sideCard.serviceFee")}
                  </span>
                  <span className="t-body-sm ink">{usd(booking.fee)}</span>
                </div>
              </div>
              <div
                className="row between"
                style={{
                  paddingTop: 16,
                  borderTop: "1px solid var(--hairline-soft)",
                }}
              >
                <span className="t-title-md ink">
                  {t("sideCard.totalUSD")}
                </span>
                <span className="t-display-sm ink">{usd(booking.total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
