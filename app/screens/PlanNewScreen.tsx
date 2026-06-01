"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import { DEFAULT_CREDITS, useAuth } from "../components/auth/AuthProvider"
import AuthRequiredModal from "../components/auth/AuthRequiredModal"
import Icon from "../components/ui/Icon"
import { useAppNavigate } from "../lib/navigation"
import {
  MAX_INTERESTS,
  TRAVEL_INTERESTS as INTERESTS,
} from "../lib/data/interests"
import { generatePlan } from "../lib/planner/generate"
import { savePlan } from "../lib/planner/storage"
import {
  BUDGET_STEP,
  KRW_PER_USD,
  MAX_TRIP_DAYS,
  computeBudgetDefault,
  computeBudgetMaximum,
  computeBudgetMinimum,
  planDayCount,
  type Transport,
} from "../lib/planner/types"
import DateRangePicker from "../components/ui/DateRangePicker"
import type { City, ExperienceCategory } from "../lib/types/domain"

// Planner destinations — mirrors mockup v7 (independent of the experience
// city filter, which only lists cities that currently have experiences).
const DESTINATIONS: readonly City[] = [
  "Seoul",
  "Busan",
  "Jeju",
  "Jeonju",
  "Gangneung",
  "Gyeongju",
  "Incheon",
  "Sokcho",
  "Daegu",
  "Yeosu",
]

const isCity = (v: string | undefined): v is City =>
  v !== undefined && (DESTINATIONS as readonly string[]).includes(v)

const isISODate = (v: string | undefined): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))

const INTEREST_LABEL: Partial<Record<ExperienceCategory, string>> =
  Object.fromEntries(INTERESTS.map((i) => [i.value, i.label]))

const TRANSPORTS: ReadonlyArray<{ value: Transport; icon: string }> = [
  { value: "public", icon: "🚇" },
  { value: "taxi", icon: "🚕" },
  { value: "car", icon: "🚗" },
] as const

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

const fmtBudget = (krw: number, locale: string): string => {
  if (locale === "ko") return `₩${krw.toLocaleString("ko-KR")}`
  const usd = Math.round(krw / KRW_PER_USD / 10) * 10
  return `$${usd.toLocaleString("en-US")}`
}

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
  color: "var(--primary)",
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
                background: reached ? "var(--primary)" : "var(--surface-strong)",
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
                    ? "var(--primary)"
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
  background: "var(--primary)",
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
  color: "var(--primary)",
  border: "2px solid var(--primary)",
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
  const locale = useLocale()
  const navigate = useAppNavigate()
  const { user } = useAuth()

  const initialStart = isISODate(initialStartDate)
    ? initialStartDate
    : addDaysISO(todayISO(), 7)
  const initialEndCandidate =
    isISODate(initialEndDate) && Date.parse(initialEndDate) >= Date.parse(initialStart)
      ? initialEndDate
      : addDaysISO(initialStart, 1)
  const clampCap = addDaysISO(initialStart, MAX_TRIP_DAYS - 1)
  const initialEnd =
    Date.parse(initialEndCandidate) > Date.parse(clampCap)
      ? clampCap
      : initialEndCandidate

  const [step, setStep] = useState<Step>(1)
  const [city, setCity] = useState<City | "">(isCity(initialCity) ? initialCity : "")
  const [startDate, setStartDate] = useState<string>(initialStart)
  const [endDate, setEndDate] = useState<string>(initialEnd)
  const [adults, setAdults] = useState<number>(1)
  const [teens, setTeens] = useState<number>(0)
  const [kids, setKids] = useState<number>(0)
  const [interests, setInterests] = useState<ExperienceCategory[]>([])
  const [transport, setTransport] = useState<Transport | "">("")
  const [budget, setBudget] = useState<number>(() =>
    computeBudgetDefault({ adults: 1, teens: 0, days: 2 }),
  )
  // Until the user drags the slider, budget tracks the computed default
  // (2× floor) as party/duration change. After a manual edit it sticks,
  // only clamped back into [min, max].
  const [budgetTouched, setBudgetTouched] = useState<boolean>(false)
  const [generating, setGenerating] = useState<boolean>(false)
  const [authOpen, setAuthOpen] = useState<boolean>(false)

  const dateRangeValid = useMemo(
    () => Date.parse(endDate) >= Date.parse(startDate),
    [startDate, endDate],
  )
  const dayCount = useMemo(
    () =>
      dateRangeValid
        ? planDayCount({
            city: (city || "Seoul") as City,
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

  const budgetMin = useMemo(
    () =>
      computeBudgetMinimum({
        adults,
        teens,
        days: dayCount > 0 ? dayCount : 1,
      }),
    [adults, teens, dayCount],
  )

  const budgetMax = useMemo(
    () =>
      computeBudgetMaximum({
        adults,
        teens,
        days: dayCount > 0 ? dayCount : 1,
      }),
    [adults, teens, dayCount],
  )

  useEffect(() => {
    if (!budgetTouched) {
      setBudget(
        computeBudgetDefault({
          adults,
          teens,
          days: dayCount > 0 ? dayCount : 1,
        }),
      )
    } else {
      setBudget((b) => Math.min(Math.max(b, budgetMin), budgetMax))
    }
  }, [adults, teens, dayCount, budgetTouched, budgetMin, budgetMax])

  const toggleInterest = (c: ExperienceCategory) => {
    setInterests((prev) => {
      if (prev.includes(c)) return prev.filter((x) => x !== c)
      if (prev.length >= MAX_INTERESTS) return prev
      return [...prev, c]
    })
  }

  const step1Valid =
    Boolean(city) && dateRangeValid && adults >= 1
  const step2Valid = interests.length > 0
  const canSubmit = step1Valid && step2Valid

  const runGeneration = () => {
    if (!city) return
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
        transport: transport || undefined,
        budget,
      })
      savePlan(plan)
      navigate("plan", { planId: plan.id })
    }, 2400)
  }

  const onSubmit = () => {
    if (!canSubmit || generating || !city) return
    if (!user) {
      setAuthOpen(true)
      return
    }
    runGeneration()
  }

  const travelerSummary = (): string => {
    const parts: string[] = [t("step3.adultsSummary", { count: adults })]
    if (teens > 0) parts.push(t("step3.teensSummary", { count: teens }))
    if (kids > 0) parts.push(t("step3.kidsSummary", { count: kids }))
    return parts.join(", ")
  }

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
                  borderTopColor: "var(--primary)",
                  borderRadius: "50%",
                  margin: "0 auto 28px",
                  animation: "spin .8s linear infinite",
                }}
              />
              <h3
                style={{
                  color: "var(--primary)",
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

              <div style={cardStyle}>
                <span style={labelStyle}>{t("step1.datesLabel")}</span>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(s, e) => {
                    setStartDate(s)
                    setEndDate(e)
                  }}
                  maxDays={MAX_TRIP_DAYS}
                />
              </div>

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
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 4,
                  }}
                >
                  <span style={labelStyle}>{t("step2.interestsLabel")}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        interests.length >= MAX_INTERESTS
                          ? "var(--primary)"
                          : "var(--muted)",
                    }}
                  >
                    {interests.length}/{MAX_INTERESTS}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    marginBottom: 14,
                  }}
                >
                  {t("step2.interestsHint", { max: MAX_INTERESTS })}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {INTERESTS.map((i) => {
                    const on = interests.includes(i.value)
                    const disabled = !on && interests.length >= MAX_INTERESTS
                    return (
                      <button
                        key={i.value}
                        type="button"
                        onClick={() => toggleInterest(i.value)}
                        aria-pressed={on}
                        disabled={disabled}
                        style={{
                          padding: "15px 18px",
                          borderRadius: 16,
                          border: `2px solid ${on ? "var(--primary)" : "var(--hairline-soft)"}`,
                          background: on ? "var(--primary-light)" : "var(--canvas)",
                          color: on ? "var(--primary)" : "var(--body)",
                          fontSize: 14,
                          fontWeight: on ? 700 : 500,
                          textAlign: "left",
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.45 : 1,
                          transition: "all .15s",
                        }}
                      >
                        {on && <span style={{ marginRight: 6 }}>✓</span>}
                        {i.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <span style={{ ...labelStyle, marginBottom: 14 }}>
                  {t("step2.transportLabel")}
                </span>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {TRANSPORTS.map(({ value, icon }) => {
                    const on = transport === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTransport(value)}
                        aria-pressed={on}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 18px",
                          borderRadius: 16,
                          border: `2px solid ${on ? "var(--primary)" : "var(--hairline-soft)"}`,
                          background: on ? "var(--primary-light)" : "var(--canvas)",
                          textAlign: "left",
                          transition: "all .15s",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{ fontSize: 22, flexShrink: 0 }}
                        >
                          {icon}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: on ? "var(--primary)" : "var(--ink)",
                            }}
                          >
                            {t(`step2.transport.${value}.label`)}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: on ? "var(--primary)" : "var(--muted)",
                              marginTop: 2,
                            }}
                          >
                            {t(`step2.transport.${value}.desc`)}
                          </div>
                        </div>
                        <div
                          aria-hidden="true"
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `2px solid ${on ? "var(--primary)" : "var(--hairline)"}`,
                            background: on ? "var(--primary)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {on && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#fff",
                              }}
                            />
                          )}
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
                      color: "var(--primary)",
                    }}
                  >
                    {fmtBudget(budget, locale)}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label={t("step2.budgetLabel")}
                  min={budgetMin}
                  max={budgetMax}
                  step={BUDGET_STEP}
                  value={budget}
                  onChange={(e) => {
                    setBudgetTouched(true)
                    setBudget(Number(e.target.value))
                  }}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    accentColor: "var(--primary)",
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
                    {fmtBudget(budgetMin, locale)}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {fmtBudget(budgetMax, locale)}
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
                      ? interests.map((c) => INTEREST_LABEL[c] ?? c).join(", ")
                      : t("step3.interestsFallback")
                  }
                />
                <SummaryRow
                  label={t("step3.transportLabel")}
                  value={
                    transport
                      ? t(`step2.transport.${transport}.label`)
                      : t("step3.transportFallback")
                  }
                />
                <SummaryRow
                  label={t("step3.budgetLabel")}
                  value={fmtBudget(budget, locale)}
                  last
                />
              </div>

              <div
                style={{
                  background: "var(--primary-light)",
                  borderRadius: 14,
                  padding: "14px 18px",
                  marginBottom: 26,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "var(--primary)", fontSize: 16, marginTop: 1 }}>
                  ✦
                </span>
                <p style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.65 }}>
                  {user
                    ? t.rich("step3.creditInfoSignedIn", {
                        count: user.credits,
                        b: (chunks) => <strong>{chunks}</strong>,
                      })
                    : t.rich("step3.creditInfoGuest", {
                        credits: DEFAULT_CREDITS,
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

      <AuthRequiredModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={() => {
          setAuthOpen(false)
          runGeneration()
        }}
      />
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
