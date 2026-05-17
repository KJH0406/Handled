"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { TIMES } from "../../lib/data/booking"
import { formatDate, usd } from "../../lib/format"
import type { Booking, Experience, Guide } from "../../lib/types/domain"
import Icon from "../ui/Icon"
import Calendar from "./Calendar"

export interface ExpBookingPanelProps {
  exp: Experience
  guide: Guide
  onReserve: (booking: Booking) => void
}

export default function ExpBookingPanel({
  exp,
  guide,
  onReserve,
}: ExpBookingPanelProps) {
  const t = useTranslations("booking.experience")
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string>("10:00")
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
        <span className="t-body-md muted">{t("perPerson")}</span>
        <span className="t-body-md muted">
          {t("duration", { duration: exp.duration })}
        </span>
      </div>
      <p className="t-caption-sm muted" style={{ marginBottom: 20 }}>
        {t("upTo", { max: exp.maxGuests })}
      </p>

      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          {t("date")}
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
              {date ? formatDate(date) : t("selectDate")}
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

      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          {t("startTime")}
        </label>
        <div className="time-grid">
          {TIMES.map((time2) => (
            <button
              key={time2}
              className={`time-cell ${time2 === time ? "active" : ""}`}
              onClick={() => setTime(time2)}
            >
              {time2}
            </button>
          ))}
        </div>
      </div>

      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          {t("guestsUpTo", { max: exp.maxGuests })}
        </label>
        <div className="stepper-bar">
          <span className="t-body-md ink" style={{ fontWeight: 600 }}>
            {Math.min(guests, exp.maxGuests)}
          </span>
          <div className="stepper">
            <button
              disabled={guests <= 1}
              onClick={() => setGuests(Math.max(1, guests - 1))}
              aria-label={t("decGuestsAria")}
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
              aria-label={t("incGuestsAria")}
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="stack-sm" style={{ marginBottom: 24 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          {t("specialRequests")}
        </label>
        <textarea
          className="input"
          style={{ resize: "vertical", minHeight: 64, fontSize: 14 }}
          placeholder={t("requestsPlaceholder")}
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary btn-block"
        onClick={onClickReserve}
        style={{ padding: "16px", fontSize: 16, fontWeight: 600 }}
      >
        {date ? t("reserveCta") : t("selectDateCta")}
      </button>
      <p
        className="t-caption-sm muted"
        style={{ textAlign: "center", marginTop: 12 }}
      >
        {t("noCharge")}
      </p>

      <div className="divider" />
      <div className="stack-sm">
        <div className="row between" style={{ gap: 8 }}>
          <span className="t-body-sm body">
            {t("linePerPerson", {
              price: usd(exp.price),
              count: effectiveGuests,
            })}
          </span>
          <span className="t-body-sm ink" style={{ flexShrink: 0 }}>
            {usd(subtotal)}
          </span>
        </div>
        <div className="row between">
          <span className="t-body-sm body">{t("serviceFee")}</span>
          <span className="t-body-sm ink">{usd(fee)}</span>
        </div>
        <div
          className="row between"
          style={{
            paddingTop: 12,
            borderTop: "1px solid var(--hairline-soft)",
          }}
        >
          <span className="t-title-md ink">{t("total")}</span>
          <span className="t-title-md ink">{usd(total)}</span>
        </div>
      </div>
    </aside>
  )
}
