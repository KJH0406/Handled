"use client"

import { useState } from "react"
import Icon from "../ui/Icon"
import Calendar from "./Calendar"
import { usd, formatDate } from "../../lib/format"
import { TIMES } from "../../lib/data/booking"

export default function ExpBookingPanel({ exp, guide, onReserve }) {
  const [date, setDate] = useState(null)
  const [time, setTime] = useState("10:00")
  const [guests, setGuests] = useState(2)
  const [showCal, setShowCal] = useState(false)
  const [requests, setRequests] = useState("")

  const effectiveGuests = Math.min(guests, exp.maxGuests)
  const subtotal = exp.price * effectiveGuests
  const fee = Math.round(subtotal * 0.1)
  const total = subtotal + fee

  const onClickReserve = () => {
    if (!date) {
      setShowCal(true)
      return
    }
    onReserve({
      mode: "experience",
      experience: exp,
      guide,
      hours: exp.duration,
      date,
      time,
      guests: Math.min(guests, exp.maxGuests),
      interests: [],
      requests,
      subtotal,
      fee,
      total,
    })
  }

  return (
    <aside className="reservation" id="reservation-panel">
      <div
        className="row"
        style={{
          alignItems: "baseline",
          marginBottom: 4,
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <span className="t-display-md ink">{usd(exp.price)}</span>
        <span className="t-body-md muted">/ person</span>
        <span className="t-body-md muted">· {exp.duration}h package</span>
      </div>
      <p className="t-caption-sm muted" style={{ marginBottom: 20 }}>
        Up to {exp.maxGuests} guests · small group
      </p>

      {/* date */}
      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          Date
        </label>
        <button
          onClick={() => setShowCal(!showCal)}
          style={{
            border: "1px solid var(--hairline)",
            borderRadius: "var(--r-sm)",
            padding: "14px 16px",
            textAlign: "left",
            background: "var(--canvas)",
            width: "100%",
          }}
        >
          <div className="row between">
            <span
              className="t-body-md"
              style={{
                color: date ? "var(--ink)" : "var(--muted-soft)",
                fontWeight: date ? 600 : 400,
              }}
            >
              {date ? formatDate(date) : "Select date"}
            </span>
            <Icon
              name={showCal ? "chevronDown" : "calendar"}
              size={16}
              stroke="var(--muted)"
            />
          </div>
        </button>
        {showCal && (
          <div
            style={{
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-sm)",
              padding: 16,
              marginTop: 4,
            }}
          >
            <Calendar
              value={date}
              onChange={(d) => {
                setDate(d)
                setShowCal(false)
              }}
            />
          </div>
        )}
      </div>

      {/* time */}
      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          Start time
        </label>
        <div className="time-grid">
          {TIMES.map((t) => (
            <button
              key={t}
              className={`time-cell ${t === time ? "active" : ""}`}
              onClick={() => setTime(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* guests */}
      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          Guests (up to {exp.maxGuests})
        </label>
        <div className="stepper-bar">
          <span className="t-body-md ink" style={{ fontWeight: 600 }}>
            {Math.min(guests, exp.maxGuests)}
          </span>
          <div className="stepper">
            <button
              disabled={guests <= 1}
              onClick={() => setGuests(Math.max(1, guests - 1))}
              aria-label="Decrease guests"
            >
              <Icon name="minus" size={14} />
            </button>
            <span
              className="t-body-md ink"
              style={{ minWidth: 16, textAlign: "center" }}
            >
              {Math.min(guests, exp.maxGuests)}
            </span>
            <button
              disabled={guests >= exp.maxGuests}
              onClick={() => setGuests(Math.min(exp.maxGuests, guests + 1))}
              aria-label="Increase guests"
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* requests */}
      <div className="stack-sm" style={{ marginBottom: 24 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          Special requests (optional)
        </label>
        <textarea
          className="input"
          style={{ resize: "vertical", minHeight: 64, fontSize: 14 }}
          placeholder="e.g. allergies, photo requests"
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
        />
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary btn-block"
        onClick={onClickReserve}
        style={{ padding: "16px", fontSize: 16, fontWeight: 600 }}
      >
        {date ? "Reserve this experience" : "Select a date"}
      </button>
      <p
        className="t-caption-sm muted"
        style={{ textAlign: "center", marginTop: 12 }}
      >
        No charge until you confirm
      </p>

      {/* breakdown */}
      <div className="divider" />
      <div className="stack-sm">
        <div className="row between" style={{ gap: 8 }}>
          <span className="t-body-sm body">
            {usd(exp.price)} × {effectiveGuests}{" "}
            {effectiveGuests === 1 ? "guest" : "guests"}
          </span>
          <span className="t-body-sm ink" style={{ flexShrink: 0 }}>
            {usd(subtotal)}
          </span>
        </div>
        <div className="row between">
          <span className="t-body-sm body">Service fee</span>
          <span className="t-body-sm ink">{usd(fee)}</span>
        </div>
        <div
          className="row between"
          style={{
            paddingTop: 12,
            borderTop: "1px solid var(--hairline-soft)",
          }}
        >
          <span className="t-title-md ink">Total</span>
          <span className="t-title-md ink">{usd(total)}</span>
        </div>
      </div>
    </aside>
  )
}
