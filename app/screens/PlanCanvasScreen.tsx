"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"
import ExperienceCard from "../components/cards/ExperienceCard"
import Icon from "../components/ui/Icon"
import PlanMap from "../components/ui/PlanMap"
import { useAppNavigate } from "../lib/navigation"
import { formatDate } from "../lib/format"
import { categoryBg } from "../lib/planner/categoryBg"
import { recommendExperiences } from "../lib/planner/recommend"
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
  const [recsVisible, setRecsVisible] = useState<boolean>(false)
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0)
  const recsRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const plan = getPlan(planId)
    setState(plan ? { kind: "ready", plan } : { kind: "missing" })
  }, [planId])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(id)
  }, [toast])

  const recommendations = useMemo(
    () =>
      state.kind === "ready" ? recommendExperiences(state.plan.input, 6) : [],
    [state],
  )

  useEffect(() => {
    if (state.kind !== "ready") return
    const node = recsRef.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => setRecsVisible(entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [state.kind])

  const onShare = async (planName: string) => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: planName, url })
        return
      } catch {
        // user cancelled or share failed - fall through to clipboard
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
      <main
        className="fade-in"
        aria-busy="true"
        aria-live="polite"
        style={{ minHeight: "60vh" }}
      >
        <span className="sr-only">{t("loading")}</span>
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
  const activeDay = plan.days[activeDayIdx] ?? plan.days[0]
  const mapSlots = activeDay?.slots ?? []
  const hasTabs = plan.days.length > 1
  const activeDayDate = (() => {
    const base = Date.parse(`${plan.input.startDate}T00:00:00`)
    if (Number.isNaN(base)) return null
    return new Date(base + activeDayIdx * 24 * 60 * 60 * 1000)
  })()

  return (
    <main className="fade-in">
      <section style={{ padding: "32px 0 48px" }}>
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
            <div
              className="row"
              style={{ gap: 8, flexShrink: 0, alignItems: "center" }}
            >
              {plan.savedAt && (
                <button
                  className="row t-body-sm"
                  onClick={() => navigate("myPlans")}
                  style={{
                    gap: 6,
                    alignItems: "center",
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label={t("savedBadge.aria")}
                >
                  <Icon name="check" size={12} stroke="var(--primary)" />
                  {t("savedBadge.label")}
                </button>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => onShare(plan.name)}
                style={{ height: 40, padding: "0 14px" }}
              >
                <Icon name="share" size={14} />
                {t("share")}
              </button>
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
              style={{ gap: 6, flexWrap: "wrap", marginBottom: 24 }}
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

          {mapSlots.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <PlanMap
                slots={mapSlots}
                dayLabel={activeDay?.label}
                ariaLabel={t("map.ariaLabel", {
                  city: plan.input.city,
                  count: mapSlots.length,
                })}
              />
              <div
                className="t-caption-sm muted"
                style={{ marginTop: 8, textAlign: "center" }}
              >
                {t("map.demoNotice")}
              </div>
            </div>
          )}

          {hasTabs && (
            <div
              role="tablist"
              aria-label={t("dayTabs.ariaLabel")}
              className="day-tabs"
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                marginTop: 24,
                marginBottom: 24,
                paddingBottom: 4,
              }}
            >
              {plan.days.map((day, idx) => {
                const active = idx === activeDayIdx
                return (
                  <button
                    key={day.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`day-panel-${day.id}`}
                    id={`day-tab-${day.id}`}
                    onClick={() => setActiveDayIdx(idx)}
                    className={`chip${active ? " active" : ""}`}
                    style={{
                      flexShrink: 0,
                      minWidth: 88,
                      justifyContent: "center",
                    }}
                  >
                    {t("dayTabs.label", { n: idx + 1 })}
                  </button>
                )
              })}
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
                    background: "var(--primary-light)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    name="bookmark"
                    size={24}
                    fill="var(--primary)"
                    stroke="var(--primary)"
                  />
                </div>
                <h2
                  id="saved-modal-title"
                  className="t-display-sm ink"
                  style={{ marginBottom: 8 }}
                >
                  {t("savedModal.title")}
                </h2>
                <p className="t-body-md muted" style={{ marginBottom: 24 }}>
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

          {activeDay && (
            <section
              key={activeDay.id}
              id={`day-panel-${activeDay.id}`}
              role="tabpanel"
              aria-labelledby={hasTabs ? `day-tab-${activeDay.id}` : undefined}
              style={{ marginTop: hasTabs ? 0 : 24 }}
            >
              <h2 className="t-display-sm ink" style={{ marginBottom: 4 }}>
                {hasTabs && activeDayDate
                  ? formatDate(activeDayDate)
                  : activeDay.label}
              </h2>
              <div className="t-caption-sm muted" style={{ marginBottom: 8 }}>
                {t("slotCount", { count: activeDay.slots.length })}
              </div>
              <div style={{ borderBottom: "1px solid var(--hairline-soft)" }}>
                {activeDay.slots.map((slot) => (
                  <SlotCard key={slot.id} slot={slot} />
                ))}
              </div>
            </section>
          )}

          {!plan.savedAt && (
            <div
              className="plan-save-callout"
              style={{
                marginTop: 48,
                padding: "32px 24px",
                borderRadius: 16,
                border: "1px solid var(--hairline-soft)",
                background: "var(--surface-soft)",
                textAlign: "center",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto 12px",
                  borderRadius: 999,
                  background: "var(--primary-light)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="bookmark"
                  size={20}
                  fill="var(--primary)"
                  stroke="var(--primary)"
                />
              </div>
              <h2 className="t-display-sm ink" style={{ marginBottom: 6 }}>
                {t("saveCallout.title")}
              </h2>
              <p
                className="t-body-md muted"
                style={{
                  marginBottom: 20,
                  maxWidth: 460,
                  margin: "0 auto 20px",
                }}
              >
                {t("saveCallout.body")}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onToggleSave(plan)}
                style={{ minWidth: 220 }}
              >
                <Icon name="bookmark" size={14} stroke="#fff" />
                {t("saveBar.cta")}
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        ref={recsRef}
        aria-labelledby="plan-recs-heading"
        style={{
          paddingTop: 64,
          paddingBottom: 120,
          borderTop: "1px solid var(--hairline)",
          background: "var(--surface-soft)",
        }}
      >
        <div className="container" style={{ maxWidth: 880 }}>
          <div
            className="t-uppercase-tag"
            style={{
              display: "inline-block",
              color: "var(--primary)",
              letterSpacing: "0.4px",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            {t("recommendations.eyebrow")}
          </div>
          <div
            className="section-header"
            style={{ marginBottom: 24, alignItems: "flex-end" }}
          >
            <div style={{ minWidth: 0 }}>
              <h2
                id="plan-recs-heading"
                className="t-display-sm ink"
                style={{ marginBottom: 6 }}
              >
                {t("recommendations.heading", { city: plan.input.city })}
              </h2>
              <p className="t-body-sm muted" style={{ margin: 0 }}>
                {t("recommendations.subheading")}
              </p>
            </div>
            <Link
              href={`/experiences?city=${encodeURIComponent(plan.input.city)}`}
              className="t-body-sm"
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              {t("recommendations.viewAll")}
              <Icon name="chevronRight" size={12} stroke="var(--primary)" />
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <p className="t-body-sm muted">
              {t("recommendations.empty", { city: plan.input.city })}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {recommendations.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} showGuide />
              ))}
            </div>
          )}
        </div>
      </section>

      <div
        className={`plan-save-bar${
          recsVisible || plan.savedAt ? " hidden" : ""
        }`}
        role="region"
        aria-label={t("saveBar.cta")}
        aria-hidden={recsVisible || Boolean(plan.savedAt)}
      >
        <div
          className="container"
          style={{
            maxWidth: 880,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="t-title-md ink" style={{ lineHeight: 1.2 }}>
              {plan.name}
            </div>
            <div className="t-caption-sm muted" style={{ marginTop: 2 }}>
              {t("saveBar.summary", {
                city: plan.input.city,
                count: dayCount,
              })}
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => onToggleSave(plan)}
            style={{ minWidth: 200 }}
          >
            <Icon name="bookmark" size={14} stroke="#fff" />
            {t("saveBar.cta")}
          </button>
        </div>
      </div>
    </main>
  )
}
