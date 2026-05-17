"use client"

import { useEffect } from "react"
import Icon from "../components/ui/Icon"
import Avatar from "../components/ui/Avatar"
import SummaryRow from "../components/ui/SummaryRow"
import { usd, formatDate } from "../lib/format"
import { useAppNavigate } from "../lib/navigation"
import { useBooking } from "../components/booking/BookingProvider"

export default function ConfirmScreen() {
  const navigate = useAppNavigate()
  const { booking, hydrated } = useBooking()
  useEffect(() => {
    const t = setTimeout(() => {
      // simple confetti-less celebration: noop
    }, 100)
    return () => clearTimeout(t)
  }, [])

  if (!hydrated) {
    return <main className="fade-in" />
  }

  if (!booking) {
    return (
      <main className="fade-in">
        <div
          className="container"
          style={{
            paddingTop: 64,
            paddingBottom: 64,
            textAlign: "center",
          }}
        >
          <p className="t-body-md muted">Booking not found.</p>
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

  return (
    <main className="fade-in">
      <div
        className="container"
        style={{
          paddingTop: 64,
          paddingBottom: 64,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{ maxWidth: 560, width: "100%", textAlign: "center" }}
        >
          {/* check icon */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "var(--rausch)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 12px 32px rgba(255, 56, 92, 0.25)",
            }}
          >
            <Icon name="check" size={44} stroke="white" sw={3} />
          </div>

          <h1 className="t-display-xl ink" style={{ marginBottom: 12 }}>
            Booking confirmed!
          </h1>
          <p
            className="t-body-md muted"
            style={{ marginBottom: 32, fontSize: 17 }}
          >
            {guide.name} will send a welcome message shortly.
          </p>

          {/* Booking summary card */}
          <div className="confirm-summary-card">
            <div
              className="row row-gap-md"
              style={{ marginBottom: 20, flexWrap: "wrap" }}
            >
              <Avatar
                src={guide.photo}
                alt={guide.name}
                name={guide.name}
                size={56}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-caption muted">Host</div>
                <div className="t-title-md ink">{guide.name}</div>
                <div className="t-caption-sm muted">
                  {guide.district}, {guide.city}
                </div>
              </div>
              <span
                className="badge-pill"
                style={{
                  background: "#fff0f3",
                  color: "var(--rausch)",
                  flexShrink: 0,
                }}
              >
                {booking.experience ? "Experience" : "Custom tour"}
              </span>
            </div>

            <div className="divider" style={{ margin: "0 0 20px" }} />

            <div className="stack-md">
              {booking.experience && (
                <SummaryRow
                  icon="sparkles"
                  label="Experience"
                  value={booking.experience.title}
                />
              )}
              <SummaryRow
                icon="calendar"
                label="Date"
                value={formatDate(booking.date)}
              />
              <SummaryRow
                icon="clock"
                label="Time"
                value={`${booking.time} · ${booking.hours} hours`}
              />
              <SummaryRow
                icon="users"
                label="Guests"
                value={`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`}
              />
              {booking.interests && booking.interests.length > 0 && (
                <SummaryRow
                  icon="award"
                  label="Interests"
                  value={booking.interests.join(" · ")}
                />
              )}
              {booking.requests && (
                <SummaryRow
                  icon="message"
                  label="Special requests"
                  value={booking.requests}
                />
              )}
              <SummaryRow
                icon="lock"
                label="Payment"
                value={`${usd(booking.total)} · Card ending in ${
                  booking.cardLast4 || "****"
                }`}
              />
              <SummaryRow
                icon="shield"
                label="Booking ID"
                value={booking.bookingId || "HD-XXXXXX"}
              />
            </div>
          </div>

          {/* email message */}
          <div
            className="row row-gap-sm"
            style={{
              background: "var(--surface-soft)",
              borderRadius: "var(--r-sm)",
              padding: "16px 20px",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <Icon name="mail" size={18} stroke="var(--ink)" />
            <span className="t-body-sm body">
              We have emailed you a receipt.
            </span>
          </div>

          {/* CTA */}
          <button
            className="btn btn-primary"
            style={{ minWidth: 240, padding: "16px 32px" }}
            onClick={() => navigate("home")}
          >
            Back to home
          </button>
          <div style={{ marginTop: 12 }}>
            <button
              className="btn-tertiary t-body-sm"
              style={{ textDecoration: "underline" }}
              onClick={() => navigate("list")}
            >
              Browse more guides
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
