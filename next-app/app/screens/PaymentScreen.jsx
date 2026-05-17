"use client"

import { useState } from "react"
import Image from "next/image"
import Icon from "../components/ui/Icon"
import Stars from "../components/ui/Stars"
import { usd, formatDate } from "../lib/format"

const fmtCard = (v) =>
  v
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19)

const fmtExp = (v) =>
  v
    .replace(/\D/g, "")
    .replace(/^(.{2})(.+)/, "$1/$2")
    .slice(0, 5)

export default function PaymentScreen({ booking, navigate, onConfirm }) {
  const [name, setName] = useState("")
  const [card, setCard] = useState("")
  const [exp, setExp] = useState("")
  const [cvc, setCvc] = useState("")
  const [zip, setZip] = useState("")
  const [errs, setErrs] = useState({})
  const [loading, setLoading] = useState(false)

  if (!booking) {
    return (
      <main className="fade-in">
        <div
          className="container"
          style={{ paddingTop: 64, paddingBottom: 64 }}
        >
          <p className="t-body-md muted">No booking information.</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("home")}
            style={{ marginTop: 16 }}
          >
            Home
          </button>
        </div>
      </main>
    )
  }

  const { guide } = booking

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = "Enter the cardholder name"
    if (card.replace(/\s/g, "").length < 16)
      e.card = "Enter a 16-digit card number"
    if (!/^\d{2}\/\d{2}$/.test(exp)) e.exp = "MM/YY format"
    if (cvc.length < 3) e.cvc = "3-digit CVC"
    if (!zip.trim()) e.zip = "Enter ZIP code"
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onConfirm({
        ...booking,
        payerName: name,
        cardLast4: card.slice(-4),
        bookingId:
          "HD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      })
    }, 1500)
  }

  return (
    <main className="fade-in">
      <div
        className="container"
        style={{ paddingTop: 24, paddingBottom: 64 }}
      >
        <div
          className="row row-gap-sm"
          style={{
            marginBottom: 16,
            color: "var(--muted)",
            cursor: "pointer",
            width: "fit-content",
          }}
          onClick={() =>
            booking.experience
              ? navigate("experience", { expId: booking.experience.id })
              : navigate("profile", { guideId: guide.id })
          }
        >
          <Icon name="arrowLeft" size={16} />
          <span className="t-body-sm">
            {booking.experience ? "Back to experience" : "Back to guide"}
          </span>
        </div>

        <h1 className="t-display-md ink" style={{ marginBottom: 32 }}>
          Checkout
        </h1>

        <div className="pay-grid">
          {/* Form */}
          <div>
            {/* trip details */}
            <div style={{ marginBottom: 32 }}>
              <h2
                className="t-display-sm ink"
                style={{ marginBottom: 16 }}
              >
                Booking summary
              </h2>
              <div
                className="stack-md"
                style={{
                  padding: 20,
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--r-md)",
                }}
              >
                <div className="row between">
                  <span className="t-body-sm body">Type</span>
                  <span
                    className="t-body-md"
                    style={{
                      fontWeight: 600,
                      color: "var(--rausch)",
                    }}
                  >
                    {booking.experience
                      ? "Experience package"
                      : "Custom tour"}
                  </span>
                </div>
                {booking.experience && (
                  <div
                    className="row between"
                    style={{ alignItems: "flex-start", gap: 16 }}
                  >
                    <span
                      className="t-body-sm body"
                      style={{ flexShrink: 0 }}
                    >
                      Experience
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
                  <span className="t-body-sm body">Date</span>
                  <span
                    className="t-body-md ink"
                    style={{ fontWeight: 500 }}
                  >
                    {formatDate(booking.date)}
                  </span>
                </div>
                <div className="row between">
                  <span className="t-body-sm body">Time</span>
                  <span
                    className="t-body-md ink"
                    style={{ fontWeight: 500 }}
                  >
                    {booking.time} · {booking.hours} hours
                  </span>
                </div>
                <div className="row between">
                  <span className="t-body-sm body">Guests</span>
                  <span
                    className="t-body-md ink"
                    style={{ fontWeight: 500 }}
                  >
                    {booking.guests}{" "}
                    {booking.guests === 1 ? "guest" : "guests"}
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
                    <span
                      className="t-body-sm body"
                      style={{ flexShrink: 0 }}
                    >
                      Interests
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
                      Special requests
                    </span>
                    <span className="t-body-sm ink">
                      {booking.requests}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* card form */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 16 }}>
              Payment method
            </h2>
            <div className="stack-base" style={{ marginBottom: 32 }}>
              <div className="field">
                <label>Cardholder name</label>
                <input
                  className={`input ${errs.name ? "error" : ""}`}
                  placeholder="HONG GILDONG"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errs.name && (
                  <span className="help-error">{errs.name}</span>
                )}
              </div>
              <div className="field">
                <label>Card number</label>
                <input
                  className={`input ${errs.card ? "error" : ""}`}
                  placeholder="1234 5678 9012 3456"
                  value={card}
                  onChange={(e) => setCard(fmtCard(e.target.value))}
                  inputMode="numeric"
                />
                {errs.card && (
                  <span className="help-error">{errs.card}</span>
                )}
              </div>
              <div className="pay-card-row">
                <div className="field">
                  <label>Expiry</label>
                  <input
                    className={`input ${errs.exp ? "error" : ""}`}
                    placeholder="MM/YY"
                    value={exp}
                    onChange={(e) => setExp(fmtExp(e.target.value))}
                    inputMode="numeric"
                  />
                  {errs.exp && (
                    <span className="help-error">{errs.exp}</span>
                  )}
                </div>
                <div className="field">
                  <label>CVC</label>
                  <input
                    className={`input ${errs.cvc ? "error" : ""}`}
                    placeholder="123"
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    inputMode="numeric"
                  />
                  {errs.cvc && (
                    <span className="help-error">{errs.cvc}</span>
                  )}
                </div>
                <div className="field">
                  <label>ZIP code</label>
                  <input
                    className={`input ${errs.zip ? "error" : ""}`}
                    placeholder="10001"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                  {errs.zip && (
                    <span className="help-error">{errs.zip}</span>
                  )}
                </div>
              </div>
            </div>

            {/* refund policy */}
            <h2 className="t-display-sm ink" style={{ marginBottom: 12 }}>
              Cancellation policy
            </h2>
            <div
              className="stack-md"
              style={{
                padding: 20,
                background: "var(--surface-soft)",
                borderRadius: "var(--r-md)",
                marginBottom: 32,
              }}
            >
              <div className="row row-gap-sm">
                <Icon name="shield" size={18} stroke="var(--ink)" />
                <span className="t-body-sm body">
                  Free cancellation up to 24h before — full refund.
                </span>
              </div>
              <div className="row row-gap-sm">
                <Icon name="clock" size={18} stroke="var(--ink)" />
                <span className="t-body-sm body">
                  Cancellations within 24h get a 50% refund.
                </span>
              </div>
              <div className="row row-gap-sm">
                <Icon name="lock" size={18} stroke="var(--ink)" />
                <span className="t-body-sm body">
                  All payments are SSL-encrypted and secure.
                </span>
              </div>
            </div>

            <p
              className="t-caption-sm muted"
              style={{ marginBottom: 16, lineHeight: 1.6 }}
            >
              By continuing, you agree to the Handled{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "var(--ink)",
                }}
              >
                Terms
              </span>
              ,{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "var(--ink)",
                }}
              >
                Privacy Policy
              </span>
              , and cancellation policy.
            </p>

            <button
              className="btn btn-primary btn-block"
              onClick={submit}
              disabled={loading}
              style={{ padding: 16, fontSize: 16, fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Processing...
                </>
              ) : (
                `Pay ${usd(booking.total)}`
              )}
            </button>
          </div>

          {/* Summary */}
          <aside>
            <div className="pay-summary-card">
              <div
                className="row row-gap-md"
                style={{ marginBottom: 16 }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 92,
                    height: 92,
                    borderRadius: "var(--r-md)",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={
                      booking.experience
                        ? booking.experience.photo
                        : guide.photo
                    }
                    alt={
                      booking.experience
                        ? booking.experience.title
                        : guide.name
                    }
                    fill
                    sizes="92px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-caption muted">
                    {guide.city} · Guided by {guide.name}
                  </div>
                  <div
                    className="t-title-md ink"
                    style={{ marginTop: 2 }}
                  >
                    {booking.experience
                      ? booking.experience.title
                      : `Custom tour with ${guide.name}`}
                  </div>
                  <div
                    className="row row-gap-xs"
                    style={{ marginTop: 4 }}
                  >
                    <Stars rating={guide.rating} />
                    <span className="t-body-sm muted">
                      ({guide.reviews})
                    </span>
                  </div>
                </div>
              </div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <div
                className="t-display-sm ink"
                style={{ marginBottom: 16 }}
              >
                Price details
              </div>
              <div className="stack-sm" style={{ marginBottom: 16 }}>
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
                      ? `${usd(booking.experience.price)} × ${booking.guests} ${
                          booking.guests === 1 ? "guest" : "guests"
                        }`
                      : `${usd(guide.hourlyRate)} × ${booking.hours}h`}
                  </span>
                  <span
                    className="t-body-sm ink"
                    style={{ flexShrink: 0 }}
                  >
                    {usd(booking.subtotal)}
                  </span>
                </div>
                <div className="row between">
                  <span className="t-body-sm body">Service fee</span>
                  <span className="t-body-sm ink">
                    {usd(booking.fee)}
                  </span>
                </div>
              </div>
              <div
                className="row between"
                style={{
                  paddingTop: 16,
                  borderTop: "1px solid var(--hairline-soft)",
                }}
              >
                <span className="t-title-md ink">Total (USD)</span>
                <span className="t-display-sm ink">
                  {usd(booking.total)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
