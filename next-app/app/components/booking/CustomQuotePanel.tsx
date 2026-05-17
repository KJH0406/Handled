"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { INTEREST_TAGS, TIMES } from "../../lib/data/booking"
import { formatDate, usd } from "../../lib/format"
import type { Booking, Guide } from "../../lib/types/domain"
import Icon from "../ui/Icon"
import Calendar from "./Calendar"

export interface CustomQuotePanelProps {
  guide: Guide
  onReserve: (booking: Booking) => void
}

export default function CustomQuotePanel({
  guide,
  onReserve,
}: CustomQuotePanelProps) {
  const t = useTranslations("booking.custom")
  const [hours, setHours] = useState(3)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string>("10:00")
  const [guests, setGuests] = useState(2)
  const [showCal, setShowCal] = useState(false)
  const [interests, setInterests] = useState<string[]>([])
  const [requests, setRequests] = useState("")

  const subtotal = guide.hourlyRate * hours
  const fee = Math.round(subtotal * 0.1)
  const total = subtotal + fee

  const toggleInterest = (i: string) =>
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
        {t("label")}
      </div>
      <div
        className="row"
        style={{ alignItems: "baseline", marginBottom: 4, gap: 4 }}
      >
        <span className="t-display-md ink">{usd(guide.hourlyRate)}</span>
        <span className="t-body-md muted">{t("perHour")}</span>
      </div>
      <p className="t-caption-sm muted" style={{ marginBottom: 20 }}>
        {t("subtitle")}
      </p>

      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          {t("tourHours")}
        </label>
        <div className="stepper-bar">
          <div>
            <div className="t-body-md ink" style={{ fontWeight: 600 }}>
              {t("tourHoursValue", { hours })}
            </div>
            <div className="t-caption-sm muted">{t("tourHoursRange")}</div>
          </div>
          <div className="stepper">
            <button
              disabled={hours <= 1}
              onClick={() => setHours(Math.max(1, hours - 1))}
              aria-label={t("decHoursAria")}
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
              aria-label={t("incHoursAria")}
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>

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
          {t("guests")}
        </label>
        <div className="stepper-bar">
          <span className="t-body-md ink" style={{ fontWeight: 600 }}>
            {guests}
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
              {guests}
            </span>
            <button
              disabled={guests >= 8}
              onClick={() => setGuests(Math.min(8, guests + 1))}
              aria-label={t("incGuestsAria")}
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="stack-sm" style={{ marginBottom: 16 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          {t("interests")}
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

      <div className="stack-sm" style={{ marginBottom: 24 }}>
        <label className="t-caption muted" style={{ fontWeight: 500 }}>
          {t("specialRequests")}
        </label>
        <textarea
          className="input"
          style={{ resize: "vertical", minHeight: 72, fontSize: 14 }}
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
        <div className="row between">
          <span className="t-body-sm body">
            {t("lineHourly", { rate: usd(guide.hourlyRate), hours })}
          </span>
          <span className="t-body-sm ink">{usd(subtotal)}</span>
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
