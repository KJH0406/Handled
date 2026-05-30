"use client"

import { useTranslations } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../components/auth/AuthProvider"
import Icon from "../components/ui/Icon"
import { useAppNavigate } from "../lib/navigation"
import { listSavedPlans, removePlan } from "../lib/planner/storage"
import { planDayCount, type Plan } from "../lib/planner/types"

const formatRange = (start: string, end: string): string => {
  if (start === end) return start
  const sameYear = start.slice(0, 4) === end.slice(0, 4)
  return sameYear ? `${start} → ${end.slice(5)}` : `${start} → ${end}`
}

const cityInitial = (city: string): string =>
  city.trim().charAt(0).toUpperCase() || "·"

const CITY_TINTS: ReadonlyArray<{ bg: string; fg: string }> = [
  { bg: "#fee2e2", fg: "#b91c1c" },
  { bg: "#dbeafe", fg: "#1d4ed8" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#dcfce7", fg: "#166534" },
  { bg: "#ede9fe", fg: "#5b21b6" },
  { bg: "#fce7f3", fg: "#9d174d" },
  { bg: "#cffafe", fg: "#0e7490" },
]

const tintFor = (city: string): { bg: string; fg: string } => {
  let hash = 0
  for (let i = 0; i < city.length; i++) {
    hash = (hash * 31 + city.charCodeAt(i)) | 0
  }
  return CITY_TINTS[Math.abs(hash) % CITY_TINTS.length]
}

interface PlanRowProps {
  plan: Plan
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  daysLabel: string
  menuAria: string
  editLabel: string
  deleteLabel: string
}

function PlanRow({
  plan,
  onOpen,
  onEdit,
  onDelete,
  daysLabel,
  menuAria,
  editLabel,
  deleteLabel,
}: PlanRowProps) {
  const tint = tintFor(plan.input.city)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onEsc)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onEsc)
    }
  }, [menuOpen])

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr auto",
        gap: 16,
        alignItems: "center",
        width: "100%",
        padding: "16px 8px",
        borderTop: "1px solid var(--hairline-soft)",
      }}
    >
      <button
        onClick={onOpen}
        aria-label={plan.name}
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: tint.bg,
          color: tint.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
        }}
      >
        {cityInitial(plan.input.city)}
      </button>
      <button
        onClick={onOpen}
        style={{
          minWidth: 0,
          background: "transparent",
          border: "none",
          padding: 0,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div
          className="t-title-md ink"
          style={{
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {plan.name}
        </div>
        <div className="t-body-sm muted" style={{ marginBottom: 2 }}>
          {formatRange(plan.input.startDate, plan.input.endDate)}
        </div>
        <div className="t-caption-sm muted">
          {plan.input.city} · {daysLabel}
        </div>
      </button>
      <div ref={menuRef} style={{ position: "relative" }}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
          aria-label={menuAria}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: "none",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="moreHorizontal" size={20} fill="currentColor" sw={0} />
        </button>
        {menuOpen && (
          <div className="account-dropdown" role="menu" style={{ minWidth: 160 }}>
            <button
              role="menuitem"
              className="account-dropdown-item"
              onClick={() => {
                setMenuOpen(false)
                onEdit()
              }}
            >
              <Icon name="edit" size={16} />
              {editLabel}
            </button>
            <button
              role="menuitem"
              className="account-dropdown-item"
              onClick={() => {
                setMenuOpen(false)
                onDelete()
              }}
              style={{ color: "var(--primary-error-text, #c13515)" }}
            >
              <Icon name="trash" size={16} />
              {deleteLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const todayISO = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

type TabId = "itineraries" | "experiences"

interface ProfileHeaderProps {
  name: string
  email: string
  copyAria: string
  copiedLabel: string
}

function ProfileHeader({
  name,
  email,
  copyAria,
  copiedLabel,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(id)
  }, [copied])

  const copyEmail = () => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(email).then(
      () => setCopied(true),
      () => {
        /* clipboard blocked - leave state unchanged */
      },
    )
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        marginBottom: 24,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 88,
          height: 88,
          borderRadius: 999,
          background: "var(--surface-strong)",
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name="user" size={44} stroke="currentColor" sw={1.5} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            className="ink"
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.4,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </span>
          <button
            onClick={copyEmail}
            aria-label={copyAria}
            style={{
              border: "none",
              background: "transparent",
              padding: 2,
              cursor: "pointer",
              color: "var(--primary)",
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Icon
              name={copied ? "check" : "copy"}
              size={20}
              stroke="currentColor"
            />
          </button>
          {copied && (
            <span className="t-caption-sm" style={{ color: "var(--primary)" }}>
              {copiedLabel}
            </span>
          )}
        </div>
        <div className="t-body-md muted">{name}</div>
      </div>
    </div>
  )
}

export default function MyPlansScreen() {
  const t = useTranslations("myPlans")
  const tCanvas = useTranslations("planner.canvas")
  const navigate = useAppNavigate()
  const { user, hydrated } = useAuth()
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [tab, setTab] = useState<TabId>("itineraries")
  const [deleting, setDeleting] = useState<Plan | null>(null)

  useEffect(() => {
    setPlans(listSavedPlans())
  }, [])

  const { upcoming, past } = useMemo(() => {
    if (!plans) return { upcoming: [], past: [] }
    const today = todayISO()
    const up: Plan[] = []
    const pa: Plan[] = []
    for (const p of plans) {
      if (p.input.endDate >= today) up.push(p)
      else pa.push(p)
    }
    up.sort((a, b) => a.input.startDate.localeCompare(b.input.startDate))
    pa.sort((a, b) => b.input.startDate.localeCompare(a.input.startDate))
    return { upcoming: up, past: pa }
  }, [plans])

  if (plans === null || !hydrated) {
    return (
      <main className="fade-in">
        <section style={{ padding: "48px 0" }}>
          <div className="container">
            <div className="t-body-sm muted">{t("loading")}</div>
          </div>
        </section>
      </main>
    )
  }

  const totalCount = plans.length
  const credits = user?.credits ?? 0
  const displayName = user?.name ?? t("guestName")
  const displayEmail = user?.email ?? t("guestEmail")

  const tabButton = (id: TabId, label: string) => (
    <button
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      style={{
        background: "transparent",
        border: "none",
        padding: "12px 0",
        cursor: "pointer",
        color: tab === id ? "var(--ink)" : "var(--muted)",
        fontWeight: tab === id ? 600 : 500,
        fontSize: 15,
        borderBottom:
          tab === id ? "2px solid var(--ink)" : "2px solid transparent",
        marginBottom: -1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  )

  return (
    <main className="fade-in">
      <section style={{ padding: "40px 0 80px" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 className="sr-only">{t("heading")}</h1>

          <ProfileHeader
            name={displayName}
            email={displayEmail}
            copyAria={t("profile.copyEmail")}
            copiedLabel={t("profile.copied")}
          />

          {/* Credit card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "20px 24px",
              borderRadius: 18,
              border: "1px solid var(--hairline-soft)",
              marginBottom: 40,
            }}
          >
            <span
              className="ink"
              style={{ fontSize: 19, fontWeight: 500, letterSpacing: -0.2 }}
            >
              {t("credits.label")}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  color: "var(--primary)",
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: -0.2,
                }}
              >
                {t("credits.value", { count: credits })}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  /* Top-up flow ships later. */
                }}
                style={{ padding: "8px 16px", fontSize: 14 }}
              >
                {t("credits.topUp")}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            style={{
              display: "flex",
              gap: 32,
              borderBottom: "1px solid var(--hairline-soft)",
              marginBottom: 24,
            }}
          >
            {tabButton("itineraries", t("tabs.itineraries", { count: totalCount }))}
            {tabButton("experiences", t("tabs.experiences"))}
          </div>

          {tab === "itineraries" && (
            <>
              <button
                onClick={() => navigate("planNew")}
                style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1fr",
                  gap: 16,
                  alignItems: "center",
                  width: "100%",
                  padding: "16px 20px",
                  background: "var(--surface-soft, #f7f7f7)",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 32,
                  textAlign: "left",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="plus" size={22} stroke="#fff" sw={2.5} />
                </div>
                <div>
                  <div className="t-title-md ink" style={{ marginBottom: 2 }}>
                    {t("createCard.title")}
                  </div>
                  <div className="t-body-sm muted">{t("createCard.subtitle")}</div>
                </div>
              </button>

              {totalCount === 0 ? (
                <div
                  style={{
                    border: "1px dashed var(--hairline)",
                    borderRadius: 14,
                    padding: "48px 24px",
                    textAlign: "center",
                  }}
                >
                  <h2 className="t-display-sm ink" style={{ marginBottom: 8 }}>
                    {t("empty.title")}
                  </h2>
                  <p className="t-body-md muted">{t("empty.subtitle")}</p>
                </div>
              ) : (
                <>
                  {upcoming.length > 0 && (
                    <section style={{ marginBottom: 40 }}>
                      <h2 className="t-display-sm ink" style={{ marginBottom: 8 }}>
                        {t("sections.upcoming")}
                      </h2>
                      <div
                        style={{ borderBottom: "1px solid var(--hairline-soft)" }}
                      >
                        {upcoming.map((p) => (
                          <PlanRow
                            key={p.id}
                            plan={p}
                            daysLabel={
                              tCanvas("datesSummary", {
                                start: p.input.startDate,
                                end: p.input.endDate,
                                count: planDayCount(p.input),
                              }).split(" · ")[1] ?? ""
                            }
                            menuAria={t("rowMenu.aria")}
                            editLabel={t("rowMenu.edit")}
                            deleteLabel={t("rowMenu.delete")}
                            onOpen={() => navigate("plan", { planId: p.id })}
                            onEdit={() => navigate("plan", { planId: p.id })}
                            onDelete={() => setDeleting(p)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {past.length > 0 && (
                    <section>
                      <h2 className="t-display-sm ink" style={{ marginBottom: 8 }}>
                        {t("sections.past")}
                      </h2>
                      <div
                        style={{ borderBottom: "1px solid var(--hairline-soft)" }}
                      >
                        {past.map((p) => (
                          <PlanRow
                            key={p.id}
                            plan={p}
                            daysLabel={
                              tCanvas("datesSummary", {
                                start: p.input.startDate,
                                end: p.input.endDate,
                                count: planDayCount(p.input),
                              }).split(" · ")[1] ?? ""
                            }
                            menuAria={t("rowMenu.aria")}
                            editLabel={t("rowMenu.edit")}
                            deleteLabel={t("rowMenu.delete")}
                            onOpen={() => navigate("plan", { planId: p.id })}
                            onEdit={() => navigate("plan", { planId: p.id })}
                            onDelete={() => setDeleting(p)}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {tab === "experiences" && (
            <div
              style={{
                border: "1px dashed var(--hairline)",
                borderRadius: 14,
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 56,
                  height: 56,
                  margin: "0 auto 16px",
                  borderRadius: 999,
                  background: "var(--surface-soft, #f7f7f7)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                }}
              >
                <Icon name="calendar" size={24} stroke="currentColor" />
              </div>
              <h2 className="t-display-sm ink" style={{ marginBottom: 8 }}>
                {t("experiences.title")}
              </h2>
              <p
                className="t-body-md muted"
                style={{ maxWidth: 420, margin: "0 auto 24px" }}
              >
                {t("experiences.subtitle")}
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("experiences")}
              >
                {t("experiences.browse")}
              </button>
            </div>
          )}
        </div>
      </section>

      {deleting && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleting(null)
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
                background: "rgba(193, 53, 21, 0.1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-error-text, #c13515)",
              }}
            >
              <Icon name="trash" size={24} stroke="currentColor" />
            </div>
            <h2
              id="delete-modal-title"
              className="t-display-sm ink"
              style={{ marginBottom: 8 }}
            >
              {t("deleteModal.title")}
            </h2>
            <p className="t-body-md muted" style={{ marginBottom: 24 }}>
              {t("deleteModal.body", { name: deleting.name })}
            </p>
            <div className="row" style={{ gap: 8, justifyContent: "stretch" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleting(null)}
                style={{ flex: 1 }}
              >
                {t("deleteModal.cancel")}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  removePlan(deleting.id)
                  setPlans(listSavedPlans())
                  setDeleting(null)
                }}
                style={{
                  flex: 1,
                  background: "var(--primary-error-text, #c13515)",
                }}
              >
                {t("deleteModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
