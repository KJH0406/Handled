"use client"

import { useState } from "react"
import Icon from "../ui/Icon"

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DOWS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const isSame = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export default function Calendar({ value, onChange, minDate }) {
  const [view, setView] = useState(() => {
    const d = value || new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const monthLabel = `${MONTH_NAMES[view.getMonth()]} ${view.getFullYear()}`
  const startDow = view.getDay()
  const daysInMonth = new Date(
    view.getFullYear(),
    view.getMonth() + 1,
    0,
  ).getDate()

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(view.getFullYear(), view.getMonth(), d))

  const today = minDate || new Date()
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
          aria-label="Previous month"
          style={{ background: "transparent" }}
        >
          <Icon name="chevronLeft" size={16} />
        </button>
        <div className="t-title-sm ink">{monthLabel}</div>
        <button
          onClick={goNext}
          className="icon-btn"
          aria-label="Next month"
          style={{ background: "transparent" }}
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
      <div className="cal-grid" style={{ marginBottom: 4 }}>
        {DOWS.map((d, i) => (
          <div key={i} className="cal-dow">
            {d}
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
