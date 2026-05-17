"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import Icon from "../ui/Icon"

const isSame = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export interface CalendarProps {
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
}

export default function Calendar({ value, onChange, minDate }: CalendarProps) {
  const t = useTranslations("calendar")
  const [view, setView] = useState<Date>(() => {
    const d = value ?? new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const monthLabel = `${t(`months.${view.getMonth()}`)} ${view.getFullYear()}`
  const startDow = view.getDay()
  const daysInMonth = new Date(
    view.getFullYear(),
    view.getMonth() + 1,
    0,
  ).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(view.getFullYear(), view.getMonth(), d))

  const today = minDate ?? new Date()
  today.setHours(0, 0, 0, 0)

  const goPrev = () =>
    setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
  const goNext = () =>
    setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          onClick={goPrev}
          className="icon-btn"
          aria-label={t("prevAria")}
          style={{ background: "transparent" }}
        >
          <Icon name="chevronLeft" size={16} />
        </button>
        <div className="t-title-sm ink">{monthLabel}</div>
        <button
          onClick={goNext}
          className="icon-btn"
          aria-label={t("nextAria")}
          style={{ background: "transparent" }}
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
      <div className="cal-grid" style={{ marginBottom: 4 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="cal-dow">
            {t(`dows.${i}`)}
          </div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((c, i) =>
          c === null ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              className={`cal-day ${isSame(c, value) ? "selected" : ""}`}
              disabled={c < today}
              onClick={() => onChange(c)}
            >
              {c.getDate()}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
