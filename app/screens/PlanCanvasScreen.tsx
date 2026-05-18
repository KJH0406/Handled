"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import Icon from "../components/ui/Icon"
import PlanGeneratingSplash from "../components/ui/PlanGeneratingSplash"
import { useAppNavigate } from "../lib/navigation"
import { categoryBg } from "../lib/planner/categoryBg"
import { getPlan, markPlanSaved } from "../lib/planner/storage"
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
            background: categoryBg(slot.category),
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
  const [toast, setToast] = useState<string | null>(null)
  const [savedModalOpen, setSavedModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const plan = getPlan(planId)
    setState(plan ? { kind: "ready", plan } : { kind: "missing" })
  }, [planId])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(id)
  }, [toast])

  const onShare = async (planName: string) => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: planName, url })
        return
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setToast(t("shareToast"))
    } catch {
      setToast(t("shareError"))
    }
  }

  const onToggleSave = (plan: Plan) => {
    const next = markPlanSaved(plan.id)
    if (!next) return
    setState({ kind: "ready", plan: next })
    setSavedModalOpen(true)
  }

  if (state.kind === "loading") {
    return (
      <main className="fade-in">
        <PlanGeneratingSplash
          title={t("loading")}
          steps={[t("loadingHint")]}
          fullscreen={false}
        />
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

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <h1 className="t-display-lg ink" style={{ margin: 0, minWidth: 0 }}>
              {plan.name}
            </h1>
            <div className="row" style={{ gap: 8, flexShrink: 0 }}>
              <button
                className="btn btn-secondary"
                onClick={() => onShare(plan.name)}
                style={{ height: 40, padding: "0 14px" }}
              >
                <Icon name="share" size={14} />
                {t("share")}
              </button>
              {!plan.savedAt && (
                <button
                  className="btn btn-secondary"
                  onClick={() => onToggleSave(plan)}
                  style={{ height: 40, padding: "0 14px" }}
                >
                  <Icon name="bookmark" size={14} />
                  {t("save")}
                </button>
              )}
            </div>
          </div>

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

          {toast && (
            <div className="toast" role="status" aria-live="polite">
              <Icon name="check" size={14} stroke="#fff" />
              {toast}
            </div>
          )}

          {savedModalOpen && (
            <div
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="saved-modal-title"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSavedModalOpen(false)
              }}
            >
              <div className="modal-card">
                <div
                  aria-hidden="true"
                  style={{
                    width: 56,
                    height: 56,
                    margin: "0 auto 16px",
                    borderRadius: 999,
                    background: "rgba(255, 56, 92, 0.1)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    name="bookmark"
                    size={24}
                    fill="var(--rausch)"
                    stroke="var(--rausch)"
                  />
                </div>
                <h2
                  id="saved-modal-title"
                  className="t-display-sm ink"
                  style={{ marginBottom: 8 }}
                >
                  {t("savedModal.title")}
                </h2>
                <p
                  className="t-body-md muted"
                  style={{ marginBottom: 24 }}
                >
                  {t("savedModal.body")}
                </p>
                <div
                  className="row"
                  style={{ gap: 8, justifyContent: "stretch" }}
                >
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSavedModalOpen(false)}
                    style={{ flex: 1 }}
                  >
                    {t("savedModal.close")}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSavedModalOpen(false)
                      navigate("myPlans")
                    }}
                    style={{ flex: 1 }}
                  >
                    {t("savedModal.viewMyPlans")}
                  </button>
                </div>
              </div>
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
