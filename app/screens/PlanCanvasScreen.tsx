"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import Icon from "../components/ui/Icon"
import { useAppNavigate } from "../lib/navigation"
import { getPlan } from "../lib/planner/storage"
import {
  planDayCount,
  planTotalTravelers,
  type Plan,
  type PlanSlot,
} from "../lib/planner/types"

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; plan: Plan }
  | { kind: "missing" }

export interface PlanCanvasScreenProps {
  planId: string
}

const formatDuration = (h: number): string => (h === 1 ? "1h" : `${h}h`)

function SlotCard({ slot }: { slot: PlanSlot }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr",
        gap: 16,
        padding: "16px 0",
        borderTop: "1px solid var(--hairline-soft)",
      }}
    >
      <div>
        <div className="t-title-md ink" style={{ lineHeight: 1.2 }}>
          {slot.time}
        </div>
        <div className="t-caption-sm muted" style={{ marginTop: 2 }}>
          {formatDuration(slot.durationH)}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <span
          className="t-uppercase-tag"
          style={{
            display: "inline-block",
            padding: "3px 8px",
            borderRadius: 999,
            background: "var(--surface-soft, #f7f7f7)",
            color: "var(--ink)",
            letterSpacing: "0.32px",
            marginBottom: 8,
          }}
        >
          {slot.category}
        </span>
        <div className="t-title-md ink" style={{ marginBottom: 4 }}>
          {slot.title}
        </div>
        {slot.note && <p className="t-body-sm body">{slot.note}</p>}
      </div>
    </div>
  )
}

export default function PlanCanvasScreen({ planId }: PlanCanvasScreenProps) {
  const t = useTranslations("planner.canvas")
  const navigate = useAppNavigate()
  const [state, setState] = useState<LoadState>({ kind: "loading" })

  useEffect(() => {
    const plan = getPlan(planId)
    setState(plan ? { kind: "ready", plan } : { kind: "missing" })
  }, [planId])

  if (state.kind === "loading") {
    return (
      <main className="fade-in">
        <section style={{ padding: "48px 0" }}>
          <div className="container" style={{ maxWidth: 880 }}>
            <div className="t-body-sm muted">{t("loading")}</div>
          </div>
        </section>
      </main>
    )
  }

  if (state.kind === "missing") {
    return (
      <main className="fade-in">
        <section style={{ padding: "80px 0" }}>
          <div
            className="container"
            style={{ maxWidth: 560, textAlign: "center" }}
          >
            <h1 className="t-display-md ink" style={{ marginBottom: 8 }}>
              {t("empty.title")}
            </h1>
            <p className="t-body-md muted" style={{ marginBottom: 24 }}>
              {t("empty.subtitle")}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("planNew")}
            >
              {t("empty.cta")}
            </button>
          </div>
        </section>
      </main>
    )
  }

  const { plan } = state
  const dayCount = planDayCount(plan.input)
  const travelers = planTotalTravelers(plan.input)

  return (
    <main className="fade-in">
      <section style={{ padding: "32px 0 80px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <Link
            href="/plan/new"
            className="t-body-sm muted"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <Icon name="chevronLeft" size={14} />
            {t("backToWizard")}
          </Link>

          <h1 className="t-display-lg ink" style={{ marginBottom: 12 }}>
            {plan.name}
          </h1>

          <div
            className="row"
            style={{
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <span
              className="row t-body-sm ink"
              style={{ gap: 6, alignItems: "center" }}
            >
              <Icon name="pin" size={14} />
              {plan.input.city}
            </span>
            <span
              className="row t-body-sm ink"
              style={{ gap: 6, alignItems: "center" }}
            >
              <Icon name="calendar" size={14} />
              {t("datesSummary", {
                start: plan.input.startDate,
                end: plan.input.endDate,
                count: dayCount,
              })}
            </span>
            <span
              className="row t-body-sm ink"
              style={{ gap: 6, alignItems: "center" }}
            >
              <Icon name="users" size={14} />
              {t("travelersSummary", { count: travelers })}
            </span>
          </div>

          {plan.input.interests.length > 0 && (
            <div
              className="row"
              style={{ gap: 6, flexWrap: "wrap", marginBottom: 40 }}
            >
              {plan.input.interests.map((c) => (
                <span
                  key={c}
                  className="chip"
                  style={{ pointerEvents: "none" }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {plan.days.map((day) => (
              <section key={day.id}>
                <h2 className="t-display-sm ink" style={{ marginBottom: 4 }}>
                  {day.label}
                </h2>
                <div className="t-caption-sm muted" style={{ marginBottom: 8 }}>
                  {t("slotCount", { count: day.slots.length })}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid var(--hairline-soft)",
                  }}
                >
                  {day.slots.map((slot) => (
                    <SlotCard key={slot.id} slot={slot} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
