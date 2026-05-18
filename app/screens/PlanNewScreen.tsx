"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import Icon from "../components/ui/Icon"
import { CITIES } from "../lib/data/filters"
import { useAppNavigate } from "../lib/navigation"
import { generatePlan } from "../lib/planner/generate"
import { savePlan } from "../lib/planner/storage"
import type { PartyType } from "../lib/planner/types"
import type { City, ExperienceCategory } from "../lib/types/domain"

const DESTINATIONS = CITIES.filter((c) => c !== "All") as readonly City[]

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const

const PARTIES: readonly PartyType[] = [
  "solo",
  "couple",
  "friends",
  "family",
  "parents",
] as const

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

const clamp = (n: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, n))

export default function PlanNewScreen() {
  const t = useTranslations("planner.wizard")
  const navigate = useAppNavigate()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [city, setCity] = useState<City>("Seoul")
  const [days, setDays] = useState<number>(2)
  const [party, setParty] = useState<PartyType>("solo")
  const [partySize, setPartySize] = useState<number>(2)
  const [interests, setInterests] = useState<ExperienceCategory[]>([])
  const [note, setNote] = useState<string>("")
  const [generating, setGenerating] = useState<boolean>(false)

  const toggleInterest = (c: ExperienceCategory) => {
    setInterests((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )
  }

  const canNext = step === 1 || step === 2 || interests.length > 0

  const onSubmit = () => {
    if (interests.length === 0 || generating) return
    setGenerating(true)
    setTimeout(() => {
      const plan = generatePlan({
        city,
        days,
        party,
        partySize,
        interests,
        freeNote: note || undefined,
      })
      savePlan(plan)
      navigate("plan", { planId: plan.id })
    }, 900)
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
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 32,
            }}
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
                {t("step1.daysLabel")}
              </div>
              <div
                className="row"
                style={{ gap: 8, flexWrap: "wrap" }}
              >
                {DAY_OPTIONS.map((n) => (
                  <button
                    key={n}
                    className={`chip ${days === n ? "active" : ""}`}
                    onClick={() => setDays(n)}
                  >
                    {t("step1.dayUnit", { count: n })}
                  </button>
                ))}
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
                {t("step2.partyLabel")}
              </div>
              <div
                className="row"
                style={{ gap: 8, flexWrap: "wrap", marginBottom: 32 }}
              >
                {PARTIES.map((p) => (
                  <button
                    key={p}
                    className={`chip ${party === p ? "active" : ""}`}
                    onClick={() => setParty(p)}
                  >
                    {t(`step2.party.${p}`)}
                  </button>
                ))}
              </div>

              <div
                className="t-caption-sm muted"
                style={{ marginBottom: 8, fontWeight: 500 }}
              >
                {t("step2.sizeLabel")}
              </div>
              <div className="row" style={{ gap: 12, alignItems: "center" }}>
                <button
                  className="icon-btn"
                  onClick={() => setPartySize((n) => clamp(n - 1, 1, 12))}
                  aria-label="decrease"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <Icon name="minus" size={16} />
                </button>
                <div
                  className="t-display-sm ink"
                  style={{ minWidth: 32, textAlign: "center" }}
                >
                  {partySize}
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setPartySize((n) => clamp(n + 1, 1, 12))}
                  aria-label="increase"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
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
                className="t-caption-sm muted"
                style={{ marginBottom: 8, fontWeight: 500 }}
              >
                {t("step3.interestsLabel")}
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
                <div
                  className="t-caption-sm muted"
                  style={{ marginBottom: 32 }}
                >
                  {t("step3.interestsHint")}
                </div>
              )}

              <div
                className="t-caption-sm muted"
                style={{ marginTop: 32, marginBottom: 8, fontWeight: 500 }}
              >
                {t("step3.noteLabel")}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("step3.notePlaceholder")}
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid var(--hairline)",
                  fontSize: 14,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                }}
              />
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
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2) : s))}
              disabled={step === 1}
              style={{ visibility: step === 1 ? "hidden" : "visible" }}
            >
              <Icon name="chevronLeft" size={14} /> {t("back")}
            </button>

            {step < TOTAL_STEPS ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                disabled={!canNext}
              >
                {t("next")} <Icon name="chevronRight" size={14} stroke="white" />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={interests.length === 0 || generating}
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
