"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import Icon from "../components/ui/Icon"
import { CITIES } from "../lib/data/filters"
import { useAppNavigate } from "../lib/navigation"
import { generatePlan } from "../lib/planner/generate"
import { savePlan } from "../lib/planner/storage"
import {
  BUDGET_DEFAULT,
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  SPECIAL_REQUESTS_MAX,
  planDayCount,
  type TourClass,
} from "../lib/planner/types"
import type { City, ExperienceCategory } from "../lib/types/domain"

const DESTINATIONS = CITIES.filter((c) => c !== "All") as readonly City[]

const isCity = (v: string | undefined): v is City =>
  v !== undefined && (DESTINATIONS as readonly string[]).includes(v)

const isISODate = (v: string | undefined): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))

const INTERESTS: readonly ExperienceCategory[] = [
  "Food",
  "Culture",
  "Photo",
  "Shopping",
  "Nightlife",
  "Architecture",
  "Art",
  "Nature",
] as const

const TOUR_CLASSES: readonly TourClass[] = ["first", "business", "economy"] as const

const TOTAL_STEPS = 3
type Step = 1 | 2 | 3

const clamp = (n: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, n))

const toISO = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const todayISO = (): string => toISO(new Date())

const addDaysISO = (iso: string, n: number): string => {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

const fmtBudget = (v: number): string => `$${v.toLocaleString()}`

const cardStyle: React.CSSProperties = {
  background: "var(--canvas)",
  borderRadius: 18,
  padding: 24,
  boxShadow: "var(--shadow-card)",
  marginBottom: 14,
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--rausch)",
  letterSpacing: 0.8,
  display: "block",
}

interface CounterProps {
  label: string
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  hasTopBorder?: boolean
}

function Counter({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
  hasTopBorder,
}: CounterProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderTop: hasTopBorder ? "1px solid var(--hairline-soft)" : "none",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1, min, max))}
          disabled={value <= min}
          aria-label={`decrease ${label}`}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `1.5px solid ${value <= min ? "var(--hairline-soft)" : "var(--hairline)"}`,
            background: "var(--canvas)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: value <= min ? "var(--muted-soft)" : "var(--body)",
            cursor: value <= min ? "not-allowed" : "pointer",
          }}
        >
          <Icon name="minus" size={14} />
        </button>
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "var(--ink)",
            minWidth: 24,
            textAlign: "center",
          }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1, min, max))}
          disabled={value >= max}
          aria-label={`increase ${label}`}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `1.5px solid ${value >= max ? "var(--hairline-soft)" : "var(--hairline)"}`,
            background: "var(--canvas)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: value >= max ? "var(--muted-soft)" : "var(--body)",
            cursor: value >= max ? "not-allowed" : "pointer",
          }}
        >
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  )
}

interface ProgressDotsProps {
  step: Step
  allDone?: boolean
}

function ProgressDots({ step, allDone }: ProgressDotsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 48,
      }}
    >
      {[1, 2, 3].map((n, idx) => {
        const reached = allDone || step >= n
        const passed = allDone || step > n
        return (
          <span key={n} style={{ display: "contents" }}>
            <div
              aria-current={step === n ? "step" : undefined}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: reached ? "var(--rausch)" : "var(--surface-strong)",
                color: reached ? "var(--on-primary)" : "var(--muted-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                transition: "all .25s",
              }}
            >
              {passed ? "✓" : n}
            </div>
            {idx < 2 && (
              <div
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 2.5,
                  borderRadius: 2,
                  background: passed
                    ? "var(--rausch)"
                    : "var(--surface-strong)",
                  transition: "all .25s",
                }}
              />
            )}
          </span>
        )
      })}
    </div>
  )
}

const headingStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  color: "var(--ink)",
  marginBottom: 8,
  letterSpacing: -1,
  lineHeight: 1.1,
}

const subheadingStyle: React.CSSProperties = {
  color: "var(--muted)",
  marginBottom: 38,
  fontSize: 15,
}

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--rausch)",
  color: "var(--on-primary)",
  border: "none",
  borderRadius: 14,
  fontSize: 15,
  fontWeight: 700,
  padding: "15px 28px",
  cursor: "pointer",
  transition: "background .15s",
}

const outlineBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "var(--rausch)",
  border: "2px solid var(--rausch)",
  borderRadius: 14,
  fontSize: 15,
  fontWeight: 700,
  padding: "13px 28px",
  cursor: "pointer",
  transition: "background .15s",
}

export interface PlanNewScreenProps {
  initialCity?: string
  initialStartDate?: string
  initialEndDate?: string
}

export default function PlanNewScreen({
  initialCity,
  initialStartDate,
  initialEndDate,
}: PlanNewScreenProps = {}) {
  const t = useTranslations("planner.wizard")
  const navigate = useAppNavigate()

  const initialStart = isISODate(initialStartDate) ? initialStartDate : todayISO()
  const initialEnd =
    isISODate(initialEndDate) && Date.parse(initialEndDate) >= Date.parse(initialStart)
      ? initialEndDate
      : addDaysISO(initialStart, 1)

  const [step, setStep] = useState<Step>(1)
  const [city, setCity] = useState<City | "">(isCity(initialCity) ? initialCity : "")
  const [startDate, setStartDate] = useState<string>(initialStart)
  const [endDate, setEndDate] = useState<string>(initialEnd)
  const [adults, setAdults] = useState<number>(1)
  const [teens, setTeens] = useState<number>(0)
  const [kids, setKids] = useState<number>(0)
  const [interests, setInterests] = useState<ExperienceCategory[]>([])
  const [tourClass, setTourClass] = useState<TourClass | "">("")
  const [budget, setBudget] = useState<number>(BUDGET_DEFAULT)
  const [specialRequests, setSpecialRequests] = useState<string>("")
  const [generating, setGenerating] = useState<boolean>(false)

  const dateRangeValid = useMemo(
    () => Date.parse(endDate) >= Date.parse(startDate),
    [startDate, endDate],
  )
  const dayCount = useMemo(
    () =>
      dateRangeValid && city
        ? planDayCount({
            city,
            startDate,
            endDate,
            adults,
            teens,
            kids,
            interests: [],
          })
        : 0,
    [city, startDate, endDate, adults, teens, kids, dateRangeValid],
  )

  const handleStartChange = (next: string) => {
    setStartDate(next)
    if (Date.parse(endDate) < Date.parse(next)) {
      setEndDate(next)
    }
  }

  const toggleInterest = (c: ExperienceCategory) => {
    setInterests((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )
  }

  const step1Valid =
    Boolean(city) && dateRangeValid && adults >= 1
  const step2Valid = interests.length > 0
  const canSubmit = step1Valid && step2Valid

  const onSubmit = () => {
    if (!canSubmit || generating || !city) return
    setGenerating(true)
    setTimeout(() => {
      const plan = generatePlan({
        city,
        startDate,
        endDate,
        adults,
        teens,
        kids,
        interests,
        tourClass: tourClass || undefined,
        budget,
        specialRequests: specialRequests.trim() || undefined,
      })
      savePlan(plan)
      navigate("plan", { planId: plan.id })
    }, 2400)
  }

  const travelerSummary = (): string => {
    const parts: string[] = [t("step3.adultsSummary", { count: adults })]
    if (teens > 0) parts.push(t("step3.teensSummary", { count: teens }))
    if (kids > 0) parts.push(t("step3.kidsSummary", { count: kids }))
    return parts.join(", ")
  }

  const tourClassLabel = (tc: TourClass | ""): string =>
    tc ? t(`step2.tourClass.${tc}.label`) : t("step3.tourClassFallback")

  return (
    <main
      className="fade-in"
      style={{ background: "var(--surface-soft)", minHeight: "100vh" }}
    >
      <section style={{ padding: "52px 0 80px" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <ProgressDots step={step} allDone={generating} />

          {generating ? (
            <div
              className="fade-in"
              style={{ textAlign: "center", padding: "90px 0" }}
              role="status"
              aria-live="polite"
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  border: "3px solid var(--hairline-soft)",
                  borderTopColor: "var(--rausch)",
                  borderRadius: "50%",
                  margin: "0 auto 28px",
                  animation: "spin .8s linear infinite",
                }}
              />
              <h3
                style={{
                  color: "var(--rausch)",
                  fontWeight: 800,
                  fontSize: 22,
                  marginBottom: 8,
                }}
              >
                {t("splash.title")}
              </h3>
              <p style={{ color: "var(--muted)" }}>{t("splash.hint")}</p>
            </div>
          ) : step === 1 ? (
            <div className="fade-in">
              <h1 style={headingStyle}>{t("step1.heading")}</h1>
              <p style={subheadingStyle}>{t("step1.subheading")}</p>

              <div style={cardStyle}>
                <label htmlFor="plan-city" style={labelStyle}>
                  {t("step1.cityLabel")}
                </label>
                <select
                  id="plan-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  style={{
                    display: "block",
                    width: "100%",
                    border: "none",
                    fontSize: 20,
                    fontWeight: 800,
                    marginTop: 8,
                    color: city ? "var(--ink)" : "var(--muted-soft)",
                    background: "transparent",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23717171' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 4px center",
                    paddingRight: 24,
                    cursor: "pointer",
                  }}
                >
                  <option value="" disabled>
                    {t("step1.cityPlaceholder")}
                  </option>
                  {DESTINATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div style={{ ...cardStyle, marginBottom: 0 }}>
                  <label htmlFor="plan-arrival" style={labelStyle}>
                    {t("step1.startLabel")}
                  </label>
                  <input
                    id="plan-arrival"
                    type="date"
                    value={startDate}
                    min={todayISO()}
                    onChange={(e) => handleStartChange(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      border: "none",
                      fontSize: 15,
                      marginTop: 8,
                      color: "var(--body)",
                      background: "transparent",
                    }}
                  />
                </div>
                <div
                  style={{
                    ...cardStyle,
                    marginBottom: 0,
                    border: dateRangeValid
                      ? undefined
                      : "1px solid var(--error)",
                  }}
                >
                  <label htmlFor="plan-departure" style={labelStyle}>
                    {t("step1.endLabel")}
                  </label>
                  <input
                    id="plan-departure"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      border: "none",
                      fontSize: 15,
                      marginTop: 8,
                      color: "var(--body)",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>
              {!dateRangeValid && (
                <div
                  style={{
                    color: "var(--error)",
                    fontSize: 12,
                    marginBottom: 14,
                    paddingLeft: 4,
                  }}
                >
                  {t("step1.datesError")}
                </div>
              )}

              <div style={cardStyle}>
                <span style={labelStyle}>{t("step1.travelersLabel")}</span>
                <div style={{ marginTop: 8 }}>
                  <Counter
                    label={t("step1.adults")}
                    value={adults}
                    onChange={setAdults}
                    min={1}
                  />
                  <Counter
                    label={t("step1.teens")}
                    value={teens}
                    onChange={setTeens}
                    hasTopBorder
                  />
                  <Counter
                    label={t("step1.kids")}
                    value={kids}
                    onChange={setKids}
                    hasTopBorder
                  />
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                  style={{
                    ...primaryBtn,
                    width: "100%",
                    opacity: step1Valid ? 1 : 0.55,
                    cursor: step1Valid ? "pointer" : "not-allowed",
                  }}
                >
                  {t("next")}
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="fade-in">
              <h1 style={headingStyle}>{t("step2.heading")}</h1>
              <p style={subheadingStyle}>{t("step2.subheading")}</p>

              <div style={{ marginBottom: 28 }}>
                <span style={{ ...labelStyle, marginBottom: 14 }}>
                  {t("step2.interestsLabel")}
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {INTERESTS.map((c) => {
                    const on = interests.includes(c)
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleInterest(c)}
                        aria-pressed={on}
                        style={{
                          padding: "15px 18px",
                          borderRadius: 16,
                          border: `2px solid ${on ? "var(--rausch)" : "var(--hairline-soft)"}`,
                          background: on ? "#fff0f3" : "var(--canvas)",
                          color: on ? "var(--rausch)" : "var(--body)",
                          fontSize: 14,
                          fontWeight: on ? 700 : 500,
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                      >
                        {on && <span style={{ marginRight: 6 }}>✓</span>}
                        {c}
                      </button>
                    )
                  })}
                </div>
                {interests.length === 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      marginTop: 10,
                    }}
                  >
                    {t("step2.interestsHint")}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 28 }}>
                <span style={{ ...labelStyle, marginBottom: 14 }}>
                  {t("step2.tourClassLabel")}
                </span>
                <div style={{ display: "flex", gap: 10 }}>
                  {TOUR_CLASSES.map((tc) => {
                    const on = tourClass === tc
                    return (
                      <button
                        key={tc}
                        type="button"
                        onClick={() => setTourClass(tc)}
                        aria-pressed={on}
                        style={{
                          flex: 1,
                          padding: "18px 14px",
                          borderRadius: 16,
                          border: `2px solid ${on ? "var(--rausch)" : "var(--hairline-soft)"}`,
                          background: on ? "#fff0f3" : "var(--canvas)",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: on ? "var(--rausch)" : "var(--ink)",
                            marginBottom: 4,
                          }}
                        >
                          {t(`step2.tourClass.${tc}.label`)}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: on ? "var(--rausch)" : "var(--muted)",
                          }}
                        >
                          {t(`step2.tourClass.${tc}.desc`)}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={cardStyle}>
                <span style={labelStyle}>{t("step2.budgetLabel")}</span>
                <div style={{ marginTop: 12 }}>
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: "var(--rausch)",
                    }}
                  >
                    {fmtBudget(budget)}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label={t("step2.budgetLabel")}
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    accentColor: "var(--rausch)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {fmtBudget(BUDGET_MIN)}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {fmtBudget(BUDGET_MAX)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ ...outlineBtn, flex: 1 }}
                >
                  {t("back")}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!step2Valid}
                  style={{
                    ...primaryBtn,
                    flex: 2,
                    opacity: step2Valid ? 1 : 0.55,
                    cursor: step2Valid ? "pointer" : "not-allowed",
                  }}
                >
                  {t("next")}
                </button>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              <h1 style={headingStyle}>{t("step3.heading")}</h1>
              <p style={subheadingStyle}>{t("step3.subheading")}</p>

              <div style={{ ...cardStyle, marginBottom: 24 }}>
                <label htmlFor="plan-requests" style={labelStyle}>
                  {t("step3.specialRequestsLabel")}
                </label>
                <textarea
                  id="plan-requests"
                  value={specialRequests}
                  onChange={(e) => {
                    if (e.target.value.length <= SPECIAL_REQUESTS_MAX)
                      setSpecialRequests(e.target.value)
                  }}
                  placeholder={t("step3.specialRequestsPlaceholder")}
                  style={{
                    display: "block",
                    width: "100%",
                    border: "1.5px solid var(--hairline-soft)",
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 14,
                    marginTop: 10,
                    color: "var(--body)",
                    resize: "vertical",
                    minHeight: 80,
                    lineHeight: 1.6,
                    background: "var(--canvas)",
                  }}
                />
                <div
                  style={{
                    textAlign: "right",
                    marginTop: 6,
                    fontSize: 12,
                    color:
                      specialRequests.length >= SPECIAL_REQUESTS_MAX - 10
                        ? "var(--rausch)"
                        : "var(--muted-soft)",
                  }}
                >
                  {t("step3.specialRequestsCounter", {
                    count: specialRequests.length,
                    max: SPECIAL_REQUESTS_MAX,
                  })}
                </div>
              </div>

              <div style={{ ...cardStyle, marginBottom: 16 }}>
                <SummaryRow
                  label={t("step3.destinationLabel")}
                  value={city || t("step3.destinationFallback")}
                />
                <SummaryRow
                  label={t("step3.arrivalLabel")}
                  value={startDate || t("step3.datesFallback")}
                />
                <SummaryRow
                  label={t("step3.departureLabel")}
                  value={
                    endDate
                      ? `${endDate}${dayCount > 0 ? ` · ${t("step1.dayUnit", { count: dayCount })}` : ""}`
                      : t("step3.datesFallback")
                  }
                />
                <SummaryRow
                  label={t("step3.travelersLabel")}
                  value={travelerSummary() || t("step3.travelersFallback")}
                />
                <SummaryRow
                  label={t("step3.interestsLabel")}
                  value={
                    interests.length > 0
                      ? interests.join(", ")
                      : t("step3.interestsFallback")
                  }
                />
                <SummaryRow
                  label={t("step3.tourClassLabel")}
                  value={tourClassLabel(tourClass)}
                />
                <SummaryRow
                  label={t("step3.budgetLabel")}
                  value={fmtBudget(budget)}
                />
                {specialRequests.trim() && (
                  <SummaryRow
                    label={t("step3.specialRequestsSummaryLabel")}
                    value={specialRequests.trim()}
                    last
                  />
                )}
              </div>

              <div
                style={{
                  background: "#fff0f3",
                  borderRadius: 14,
                  padding: "14px 18px",
                  marginBottom: 26,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "var(--rausch)", fontSize: 16, marginTop: 1 }}>
                  ✦
                </span>
                <p style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.65 }}>
                  {t.rich("step3.creditInfo", {
                    b: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ ...outlineBtn, flex: 1 }}
                >
                  {t("back")}
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSubmit || generating}
                  style={{
                    ...primaryBtn,
                    flex: 2,
                    opacity: canSubmit && !generating ? 1 : 0.55,
                    cursor:
                      canSubmit && !generating ? "pointer" : "not-allowed",
                  }}
                >
                  {generating ? t("generating") : t("submit")}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

interface SummaryRowProps {
  label: string
  value: React.ReactNode
  last?: boolean
}

function SummaryRow({ label, value, last }: SummaryRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "13px 0",
        borderBottom: last ? "none" : "1px solid var(--hairline-soft)",
      }}
    >
      <span
        style={{
          color: "var(--muted)",
          fontSize: 14,
          flexShrink: 0,
          marginRight: 16,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: 600,
          color: "var(--ink)",
          fontSize: 14,
          maxWidth: 280,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  )
}
