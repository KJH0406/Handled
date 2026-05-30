"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"

const MS_PER_DAY = 24 * 60 * 60 * 1000

const toISO = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const fromISO = (iso: string): Date | undefined => {
  if (!iso) return undefined
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? undefined : d
}

const startOfToday = (): Date => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const startOfMonth = (d: Date): Date => {
  const x = new Date(d)
  x.setDate(1)
  x.setHours(0, 0, 0, 0)
  return x
}

const addDays = (d: Date, n: number): Date => {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

const addMonths = (d: Date, n: number): Date => {
  const out = new Date(d)
  out.setMonth(out.getMonth() + n)
  return out
}

const sameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const diffDays = (a: Date, b: Date): number =>
  Math.round((a.getTime() - b.getTime()) / MS_PER_DAY)

const buildGrid = (month: Date): Date[] => {
  const first = startOfMonth(month)
  const offset = first.getDay()
  const gridStart = addDays(first, -offset)
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
  /** Maximum inclusive span. Days beyond start + (maxDays - 1) are blocked. */
  maxDays: number
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  maxDays,
}: DateRangePickerProps) {
  const locale = useLocale()
  const t = useTranslations("planner.wizard.step1")
  const [open, setOpen] = useState(false)
  const [hoverDay, setHoverDay] = useState<Date | undefined>(undefined)
  const ref = useRef<HTMLDivElement | null>(null)

  const today = startOfToday()
  const from = fromISO(startDate)
  const to = fromISO(endDate)

  const [month, setMonth] = useState<Date>(() =>
    startOfMonth(from ?? today),
  )

  useEffect(() => {
    if (!open) {
      setHoverDay(undefined)
      return
    }
    if (from) setMonth(startOfMonth(from))
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onEsc)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onEsc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // "picking end" = start is set and end is missing or equal to start
  const pickingEnd =
    Boolean(from) && (!to || (from !== undefined && sameDay(from, to)))

  // Hover preview only while choosing end and hovering after start
  const previewEnd =
    pickingEnd && from && hoverDay && hoverDay > from && !isDisabled(hoverDay)
      ? hoverDay
      : to && from && !sameDay(from, to)
        ? to
        : undefined

  function isDisabled(d: Date): boolean {
    if (d < today) return true
    if (pickingEnd && from && d > from) {
      if (diffDays(d, from) > maxDays - 1) return true
    }
    return false
  }

  function inRange(d: Date, end: Date | undefined): boolean {
    if (!from || !end) return false
    return d > from && d < end
  }

  const onDayClick = (d: Date) => {
    if (isDisabled(d)) return
    if (!from) {
      onChange(toISO(d), "")
      return
    }
    if (pickingEnd) {
      if (sameDay(d, from)) {
        onChange("", "")
        return
      }
      if (d < from) {
        onChange(toISO(d), "")
        return
      }
      onChange(toISO(from), toISO(d))
      setOpen(false)
      return
    }
    // Both set already — start a new range
    onChange(toISO(d), "")
  }

  const grid = useMemo(() => buildGrid(month), [month])
  const weekdayLabels = useMemo(() => {
    const baseSun = new Date(2024, 0, 7)
    return Array.from({ length: 7 }, (_, i) =>
      addDays(baseSun, i).toLocaleDateString(
        locale === "ko" ? "ko-KR" : "en-US",
        { weekday: "narrow" },
      ),
    )
  }, [locale])

  const monthLabel = month.toLocaleDateString(
    locale === "ko" ? "ko-KR" : "en-US",
    { year: "numeric", month: "long" },
  )

  const fmtDay = (d: Date) =>
    d.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
    })

  const hasFullRange = Boolean(from && to && !sameDay(from, to))
  const rangeText = !from
    ? t("datesPlaceholder")
    : !to || sameDay(from, to)
      ? fmtDay(from)
      : `${fmtDay(from)} ~ ${fmtDay(to)}`
  const dayCountLabel =
    hasFullRange && from && to ? t("dayUnit", { count: diffDays(to, from) + 1 }) : ""

  const canPrev = startOfMonth(month).getTime() > startOfMonth(today).getTime()

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("datesLabel")}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          border: "none",
          background: "transparent",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23717171' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
          padding: "0 24px 0 0",
          marginTop: 8,
          fontSize: 20,
          fontWeight: 800,
          color: from ? "var(--ink)" : "var(--muted-soft)",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            flex: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {rangeText}
        </span>
        {hasFullRange && (
          <span
            style={{
              flexShrink: 0,
              marginLeft: 12,
              padding: "5px 12px",
              borderRadius: 999,
              background: "#fff0f3",
              color: "var(--rausch)",
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {dayCountLabel}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("datesLabel")}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 240,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "rgba(0, 0, 0, 0.16) 0 12px 32px",
            padding: 16,
            width: 320,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <button
              type="button"
              onClick={() => canPrev && setMonth((m) => addMonths(m, -1))}
              disabled={!canPrev}
              aria-label={t("monthPrevAria")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                border: "none",
                background: "transparent",
                cursor: canPrev ? "pointer" : "not-allowed",
                color: canPrev ? "var(--ink)" : "var(--muted-soft)",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ‹
            </button>
            <span
              style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}
            >
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              aria-label={t("monthNextAria")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--ink)",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              marginBottom: 4,
            }}
          >
            {weekdayLabels.map((w, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--muted)",
                  padding: "6px 0",
                  textTransform: "uppercase",
                }}
              >
                {w}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              rowGap: 2,
            }}
            onMouseLeave={() => setHoverDay(undefined)}
          >
            {grid.map((d) => {
              const isCurrentMonth = d.getMonth() === month.getMonth()
              const disabled = isDisabled(d)
              const isStart = from ? sameDay(d, from) : false
              const isEnd =
                previewEnd && !isStart ? sameDay(d, previewEnd) : false
              const middle = inRange(d, previewEnd)
              const isToday = sameDay(d, today)

              let bg = "transparent"
              let color = isCurrentMonth ? "var(--ink)" : "var(--muted-soft)"
              if (disabled) color = "var(--muted-soft)"
              if (middle) bg = "#fff0f3"
              if (isStart || isEnd) {
                bg = "var(--rausch)"
                color = "#fff"
              }

              return (
                <button
                  key={toISO(d)}
                  type="button"
                  disabled={disabled}
                  onClick={() => onDayClick(d)}
                  onMouseEnter={() => {
                    if (!disabled) setHoverDay(d)
                  }}
                  aria-label={fmtDay(d)}
                  aria-pressed={isStart || isEnd}
                  style={{
                    height: 36,
                    width: "100%",
                    border: "none",
                    background: bg,
                    color,
                    borderRadius:
                      isStart || isEnd ? 999 : middle ? 0 : 8,
                    fontSize: 13,
                    fontWeight: isToday ? 700 : 500,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: !isCurrentMonth && !disabled ? 0.45 : 1,
                    outline:
                      isToday && !isStart && !isEnd
                        ? "1.5px solid var(--rausch)"
                        : "none",
                    outlineOffset: -2,
                    padding: 0,
                  }}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: 12,
              color: "var(--muted)",
              textAlign: "center",
            }}
          >
            {t("datesMaxHint", { max: maxDays })}
          </p>
        </div>
      )}
    </div>
  )
}
