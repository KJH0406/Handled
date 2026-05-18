"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import Icon from "../components/ui/Icon"
import PlanGeneratingSplash from "../components/ui/PlanGeneratingSplash"
import { CITIES } from "../lib/data/filters"
import { useAppNavigate } from "../lib/navigation"
import { generatePlan } from "../lib/planner/generate"
import { savePlan } from "../lib/planner/storage"
import { planDayCount } from "../lib/planner/types"
import type { City, ExperienceCategory } from "../lib/types/domain"

const DESTINATIONS = CITIES.filter((c) => c !== "All") as readonly City[]

const INTERESTS: readonly ExperienceCategory[] = [
  "Food",
  "Culture",
  "Photo",
  "Shopping",
  "Nightlife",
  "Architecture",
  "Art",
  "Nature",
  "Beach",
  "Traditional",
  "Urban",
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

interface StepperProps {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  label: string
  hint?: string
}

function Stepper({ value, onChange, min = 0, max = 12, label, hint }: StepperProps) {
  return (
    <div
      className="row"
      style={{
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        paddingBlock: 12,
      }}
    >
      <div>
        <div className="t-body-md ink">{label}</div>
        {hint && <div className="t-caption-sm muted">{hint}</div>}
      </div>
      <div className="row" style={{ gap: 12, alignItems: "center" }}>
        <button
          className="icon-btn"
          onClick={() => onChange(clamp(value - 1, min, max))}
          aria-label={`decrease ${label}`}
          disabled={value <= min}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: "1px solid var(--hairline)",
            opacity: value <= min ? 0.4 : 1,
          }}
        >
          <Icon name="minus" size={14} />
        </button>
        <div
          className="t-body-md ink"
          style={{ minWidth: 24, textAlign: "center" }}
        >
          {value}
        </div>
        <button
          className="icon-btn"
          onClick={() => onChange(clamp(value + 1, min, max))}
          aria-label={`increase ${label}`}
          disabled={value >= max}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: "1px solid var(--hairline)",
            opacity: value >= max ? 0.4 : 1,
          }}
        >
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  )
}

interface ReviewRowProps {
  label: string
  value: React.ReactNode
  editLabel: string
  onEdit: () => void
}

function ReviewRow({ label, value, editLabel, onEdit }: ReviewRowProps) {
  return (
    <div
      className="row"
      style={{
        gap: 16,
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid var(--hairline-soft)",
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="t-caption-sm muted" style={{ marginBottom: 4 }}>
          {label}
        </div>
        <div className="t-body-md ink">{value}</div>
      </div>
      <button
        className="btn-tertiary t-body-sm"
        style={{ textDecoration: "underline", flexShrink: 0 }}
        onClick={onEdit}
      >
        {editLabel}
      </button>
    </div>
  )
}

export default function PlanNewScreen() {
  const t = useTranslations("planner.wizard")
  const navigate = useAppNavigate()

  const [step, setStep] = useState<Step>(1)
  const [city, setCity] = useState<City>("Seoul")
  const [startDate, setStartDate] = useState<string>(todayISO())
  const [endDate, setEndDate] = useState<string>(addDaysISO(todayISO(), 1))
  const [adults, setAdults] = useState<number>(1)
  const [teens, setTeens] = useState<number>(0)
  const [kids, setKids] = useState<number>(0)
  const [interests, setInterests] = useState<ExperienceCategory[]>([])
  const [generating, setGenerating] = useState<boolean>(false)

  const dateRangeValid = useMemo(
    () => Date.parse(endDate) >= Date.parse(startDate),
    [startDate, endDate],
  )
  const dayCount = useMemo(
    () =>
      dateRangeValid
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

  const step1Valid = Boolean(city) && dateRangeValid && adults >= 1
  const step2Valid = interests.length > 0
  const canNext =
    (step === 1 && step1Valid) ||
    (step === 2 && step2Valid) ||
    step === 3
  const canSubmit = step1Valid && step2Valid

  const onSubmit = () => {
    if (!canSubmit || generating) return
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
      })
      savePlan(plan)
      navigate("plan", { planId: plan.id })
    }, 4500)
  }

  const splashSteps = [
    t("splash.step1", { city }),
    t("splash.step2"),
    t("splash.step3"),
    t("splash.step4"),
  ]

  const travelerSummary = (): string =>
    [
      t("step3.adultsSummary", { count: adults }),
      teens > 0 ? t("step3.teensSummary", { count: teens }) : null,
      kids > 0 ? t("step3.kidsSummary", { count: kids }) : null,
    ]
      .filter(Boolean)
      .join(" · ")

  if (generating) {
    return (
      <main className="fade-in">
        <section style={{ padding: "48px 0 80px" }}>
          <div className="container" style={{ maxWidth: 720 }}>
            <PlanGeneratingSplash
              title={t("splash.title")}
              steps={splashSteps}
              stepIntervalMs={1000}
              fullscreen={false}
            />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="fade-in">
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div
            className="t-caption-sm muted"
            style={{ marginBottom: 8, letterSpacing: 0.2 }}
          >
            {t("stepLabel", { current: step, total: TOTAL_STEPS })}
          </div>
          <div
            aria-hidden="true"
            style={{ display: "flex", gap: 6, marginBottom: 32 }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 4,
                  background:
                    n <= step ? "var(--rausch)" : "var(--hairline-soft)",
                  transition: "background 200ms",
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="fade-in">
              <h1 className="t-display-md ink" style={{ marginBottom: 8 }}>
                {t("step1.heading")}
              </h1>
              <p className="t-body-sm muted" style={{ marginBottom: 32 }}>
                {t("step1.subheading")}
              </p>

              <div
                className="t-caption-sm muted"
                style={{ marginBottom: 8, fontWeight: 500 }}
              >
                {t("step1.cityLabel")}
              </div>
              <div
                className="row"
                style={{ gap: 8, flexWrap: "wrap", marginBottom: 32 }}
              >
                {DESTINATIONS.map((c) => (
                  <button
                    key={c}
                    className={`chip ${city === c ? "active" : ""}`}
                    onClick={() => setCity(c)}
                  >
                    <Icon name="pin" size={14} />
                    {c}
                  </button>
                ))}
              </div>

              <div
                className="t-caption-sm muted"
                style={{ marginBottom: 8, fontWeight: 500 }}
              >
                {t("step1.datesLabel")}
              </div>
              <div
                className="row"
                style={{ gap: 12, flexWrap: "wrap", marginBottom: 8 }}
              >
                <label
                  style={{
                    flex: 1,
                    minWidth: 180,
                    border: "1px solid var(--hairline)",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div className="t-caption-sm muted">
                    {t("step1.startLabel")}
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    min={todayISO()}
                    onChange={(e) => handleStartChange(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: 14,
                      width: "100%",
                      background: "transparent",
                      color: "var(--ink)",
                      marginTop: 2,
                    }}
                  />
                </label>
                <label
                  style={{
                    flex: 1,
                    minWidth: 180,
                    border: `1px solid ${dateRangeValid ? "var(--hairline)" : "var(--primary-error-text, #c13515)"}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div className="t-caption-sm muted">
                    {t("step1.endLabel")}
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: 14,
                      width: "100%",
                      background: "transparent",
                      color: "var(--ink)",
                      marginTop: 2,
                    }}
                  />
                </label>
              </div>
              {dateRangeValid ? (
                <div
                  className="t-caption-sm muted"
                  style={{ marginBottom: 32 }}
                >
                  {t("step1.dayUnit", { count: dayCount })}
                </div>
              ) : (
                <div
                  className="t-caption-sm"
                  style={{
                    color: "var(--primary-error-text, #c13515)",
                    marginBottom: 32,
                  }}
                >
                  {t("step1.datesError")}
                </div>
              )}

              <div
                className="t-caption-sm muted"
                style={{ marginBottom: 4, fontWeight: 500 }}
              >
                {t("step1.travelersLabel")}
              </div>
              <div
                style={{
                  border: "1px solid var(--hairline)",
                  borderRadius: 12,
                  paddingInline: 16,
                }}
              >
                <Stepper
                  label={t("step1.adults")}
                  hint={t("step1.adultsHint")}
                  value={adults}
                  onChange={setAdults}
                  min={1}
                  max={12}
                />
                <div style={{ height: 1, background: "var(--hairline-soft)" }} />
                <Stepper
                  label={t("step1.teens")}
                  hint={t("step1.teensHint")}
                  value={teens}
                  onChange={setTeens}
                  min={0}
                  max={12}
                />
                <div style={{ height: 1, background: "var(--hairline-soft)" }} />
                <Stepper
                  label={t("step1.kids")}
                  hint={t("step1.kidsHint")}
                  value={kids}
                  onChange={setKids}
                  min={0}
                  max={12}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h1 className="t-display-md ink" style={{ marginBottom: 8 }}>
                {t("step2.heading")}
              </h1>
              <p className="t-body-sm muted" style={{ marginBottom: 32 }}>
                {t("step2.subheading")}
              </p>

              <div
                className="t-caption-sm muted"
                style={{ marginBottom: 8, fontWeight: 500 }}
              >
                {t("step2.interestsLabel")}
              </div>
              <div
                className="row"
                style={{ gap: 8, flexWrap: "wrap", marginBottom: 8 }}
              >
                {INTERESTS.map((c) => {
                  const active = interests.includes(c)
                  return (
                    <button
                      key={c}
                      className={`chip ${active ? "active" : ""}`}
                      onClick={() => toggleInterest(c)}
                    >
                      {active && <Icon name="check" size={12} />}
                      {c}
                    </button>
                  )
                })}
              </div>
              {interests.length === 0 && (
                <div className="t-caption-sm muted">
                  {t("step2.interestsHint")}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h1 className="t-display-md ink" style={{ marginBottom: 8 }}>
                {t("step3.heading")}
              </h1>
              <p className="t-body-sm muted" style={{ marginBottom: 32 }}>
                {t("step3.subheading")}
              </p>

              <div
                style={{
                  border: "1px solid var(--hairline)",
                  borderRadius: 12,
                  paddingInline: 20,
                }}
              >
                <ReviewRow
                  label={t("step3.destinationLabel")}
                  value={city}
                  editLabel={t("edit")}
                  onEdit={() => setStep(1)}
                />
                <ReviewRow
                  label={t("step3.datesLabel")}
                  value={t("step3.datesSummary", {
                    start: startDate,
                    end: endDate,
                    count: dayCount,
                  })}
                  editLabel={t("edit")}
                  onEdit={() => setStep(1)}
                />
                <ReviewRow
                  label={t("step3.travelersLabel")}
                  value={travelerSummary()}
                  editLabel={t("edit")}
                  onEdit={() => setStep(1)}
                />
                <div
                  className="row"
                  style={{
                    gap: 16,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "16px 0",
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      className="t-caption-sm muted"
                      style={{ marginBottom: 6 }}
                    >
                      {t("step3.interestsLabel")}
                    </div>
                    <div
                      className="row"
                      style={{ gap: 6, flexWrap: "wrap" }}
                    >
                      {interests.map((c) => (
                        <span
                          key={c}
                          className="chip active"
                          style={{ pointerEvents: "none" }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="btn-tertiary t-body-sm"
                    style={{
                      textDecoration: "underline",
                      flexShrink: 0,
                    }}
                    onClick={() => setStep(2)}
                  >
                    {t("edit")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="row"
            style={{
              gap: 12,
              marginTop: 40,
              justifyContent: "space-between",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() =>
                setStep((s) => (s > 1 ? ((s - 1) as Step) : s))
              }
              disabled={step === 1}
              style={{ visibility: step === 1 ? "hidden" : "visible" }}
            >
              <Icon name="chevronLeft" size={14} /> {t("back")}
            </button>

            {step < TOTAL_STEPS ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!canNext}
              >
                {t("next")} <Icon name="chevronRight" size={14} stroke="white" />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={!canSubmit || generating}
              >
                {generating ? t("generating") : t("submit")}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
