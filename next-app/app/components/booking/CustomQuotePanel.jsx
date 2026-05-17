"use client"

import { useState } from "react"
import Icon from "../ui/Icon"
import Calendar from "./Calendar"
import { usd, formatDate } from "../../lib/format"
import { TIMES, INTEREST_TAGS } from "../../lib/data/booking"

export default function CustomQuotePanel({ guide, onReserve }) {
  const [hours, setHours] = useState(3)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState("10:00")
  const [guests, setGuests] = useState(2)
  const [showCal, setShowCal] = useState(false)
  const [interests, setInterests] = useState([])
  const [requests, setRequests] = useState("")

  const subtotal = guide.hourlyRate * hours
  const fee = Math.round(subtotal * 0.1)
  const total = subtotal + fee

  const toggleInterest = (i) =>
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    )

  const onClickReserve = () => {
    if (!date) {
      setShowCal(true)
      return
    }
    onReserve({
      mode: "custom",
      experience: null,
      guide,
      hours,
      date,
      time,
      guests,
      interests,
      requests,
      subtotal,
      fee,
      total,
    })
  }

  return (
    <aside className="reservation" id="reservation-panel">
      <div
        className="t-caption muted"
        style={{ fontWeight: 600, marginBottom: 4 }}
      >
        Custom tour quote
      </div>
      <div
        className="row"
        style={{ alignItems: "baseline", marginBottom: 4, gap: 4 }}
      >
        <span className="t-display-md ink">{usd(guide.hourlyRate)}</span>
        <span className="t-body-md muted">/ hour</span>
      </div>
      <p className="t-caption-sm muted" style={{ marginBottom: 20 }}>
        Build a tour with your preferred hours and interests
      </p>

      {/* hours */}
      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          Tour hours
        </label>
        <div className="stepper-bar">
          <div>
            <div className="t-body-md ink" style={{ fontWeight: 600 }}>
              {hours}h
            </div>
            <div className="t-caption-sm muted">Min 1h · Max 8h</div>
          </div>
          <div className="stepper">
            <button
              disabled={hours <= 1}
              onClick={() => setHours(Math.max(1, hours - 1))}
              aria-label="Decrease hours"
            >
              <Icon name="minus" size={14} />
            </button>
            <span
              className="t-body-md ink"
              style={{ minWidth: 16, textAlign: "center" }}
            >
              {hours}
            </span>
            <button
              disabled={hours >= 8}
              onClick={() => setHours(Math.min(8, hours + 1))}
              aria-label="Increase hours"
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>

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
          Guests
        </label>
        <div className="stepper-bar">
          <span className="t-body-md ink" style={{ fontWeight: 600 }}>
            {guests}
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
              {guests}
            </span>
            <button
              disabled={guests >= 8}
              onClick={() => setGuests(Math.min(8, guests + 1))}
              aria-label="Increase guests"
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* interests */}
      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          Interests (multi-select)
        </label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {INTEREST_TAGS.map((i) => (
            <button
              key={i}
              className={`chip ${interests.includes(i) ? "active" : ""}`}
              style={{ padding: "6px 12px", fontSize: 12 }}
              onClick={() => toggleInterest(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* requests */}
      <div className="stack-sm" style={{ marginBottom: 24 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          Special requests (optional)
        </label>
        <textarea
          className="input"
          style={{ resize: "vertical", minHeight: 72, fontSize: 14 }}
          placeholder="e.g. Vegetarian · with a 4-year-old · please take lots of photos"
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
        {date ? "Reserve custom tour" : "Select a date"}
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
        <div className="row between">
          <span className="t-body-sm body">
            {usd(guide.hourlyRate)} × {hours}h
          </span>
          <span className="t-body-sm ink">{usd(subtotal)}</span>
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
