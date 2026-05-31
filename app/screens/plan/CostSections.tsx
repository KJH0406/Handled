"use client"

import { useLocale, useTranslations } from "next-intl"
import Icon from "../../components/ui/Icon"
import { categoryColor } from "../../lib/data/categoryColors"
import { money } from "../../lib/format"
import type {
  CostedDay,
  CostedLodging,
  CostedPlan,
  CostedSlot,
  CostedTransit,
} from "../../lib/planner/costing"

const formatDuration = (h: number): string => (h === 1 ? "1h" : `${h}h`)

/** On-brand green reused from the Nature category for "free" affordances. */
const FREE_COLOR = categoryColor("Nature")

const TRANSPORT_EMOJI: Record<CostedTransit["mode"], string> = {
  public: "🚇",
  taxi: "🚕",
  car: "🚗",
}

/** Travel leg shown between two stops. */
export function TransitConnector({ transit }: { transit: CostedTransit }) {
  const t = useTranslations("planner.canvas.cost")
  const locale = useLocale()
  const amount = transit.included
    ? t("transit.included")
    : transit.costKRW === 0
      ? t("transit.free")
      : money(transit.costKRW, locale)
  const free = !transit.included && transit.costKRW === 0
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "0 0 0 24px",
        padding: "8px 14px",
        borderLeft: "2px dashed var(--hairline)",
      }}
    >
      <span aria-hidden style={{ fontSize: 15 }}>
        {TRANSPORT_EMOJI[transit.mode]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-caption-sm muted" style={{ fontWeight: 600 }}>
          {t(`transit.label.${transit.mode}`)}
        </div>
        <div className="t-caption-sm muted">
          {t(`transit.info.${transit.mode}`)}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          className="t-caption-sm"
          style={{ color: "var(--primary)", fontWeight: 700 }}
        >
          {t("transit.minutes", { min: transit.durationMin })}
        </div>
        <div
          className="t-caption-sm"
          style={{
            color: transit.included || free ? FREE_COLOR.solid : "var(--muted)",
            fontWeight: transit.included || free ? 700 : 400,
          }}
        >
          {amount}
        </div>
      </div>
    </div>
  )
}

export function CostedSlotCard({ costed }: { costed: CostedSlot }) {
  const t = useTranslations("planner.canvas.cost")
  const locale = useLocale()
  const { slot, costKRW, noteKey } = costed
  const free = costKRW === 0
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span
            className="t-uppercase-tag"
            style={{
              display: "inline-block",
              padding: "3px 8px",
              borderRadius: 999,
              background: categoryColor(slot.category).softBg,
              color: "var(--ink)",
              letterSpacing: "0.32px",
            }}
          >
            {slot.category}
          </span>
          <span
            className="t-caption-sm"
            style={{
              flexShrink: 0,
              padding: "4px 10px",
              borderRadius: 999,
              fontWeight: 700,
              background: free ? FREE_COLOR.softBg : "var(--primary-light)",
              color: free ? FREE_COLOR.solid : "var(--primary)",
            }}
          >
            {free ? t("free") : money(costKRW, locale)}
          </span>
        </div>
        <div className="t-title-md ink" style={{ margin: "8px 0 4px" }}>
          {slot.title}
        </div>
        {slot.note && <p className="t-body-sm body">{slot.note}</p>}
        <div className="t-caption-sm muted" style={{ marginTop: 6 }}>
          {t(`note.${noteKey}`)}
        </div>
      </div>
    </div>
  )
}

export function HotelCard({ lodging }: { lodging: CostedLodging }) {
  const t = useTranslations("planner.canvas.cost")
  const locale = useLocale()
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        padding: "16px 18px",
        borderRadius: 14,
        border: "1px solid var(--hairline-soft)",
        background: "var(--canvas)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: 20,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "var(--primary-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        🏨
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="t-title-md ink">{lodging.name}</div>
            <div
              className="t-caption-sm muted"
              style={{
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{lodging.area}</span>
              <span aria-hidden>·</span>
              <span
                aria-label={`${lodging.stars} stars`}
                style={{ display: "inline-flex", alignItems: "center", gap: 1 }}
              >
                {Array.from({ length: lodging.stars }).map((_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    size={11}
                    fill="var(--gold)"
                    stroke="var(--gold)"
                    sw={1}
                  />
                ))}
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="t-title-md" style={{ color: "var(--primary)" }}>
              {money(lodging.nightlyKRW, locale)}
            </div>
            <div className="t-caption-sm muted">{t("lodging.perNight")}</div>
          </div>
        </div>
        <p className="t-body-sm body" style={{ marginTop: 8 }}>
          {t(`lodging.blurb.${lodging.stars}`, { area: lodging.area })}
        </p>
      </div>
    </div>
  )
}

export function DayTotals({
  costedDay,
  transport,
}: {
  costedDay: CostedDay
  transport: CostedPlan["transport"]
}) {
  const t = useTranslations("planner.canvas.cost")
  const locale = useLocale()
  return (
    <div style={{ marginTop: 20 }}>
      {costedDay.transitKRW > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 8,
            borderTop: "1px dashed var(--hairline-soft)",
          }}
        >
          <span className="t-body-sm body">
            {t(`transitLine.${transport}`)}
          </span>
          <span className="t-body-sm ink" style={{ fontWeight: 600 }}>
            {money(costedDay.transitKRW, locale)}
          </span>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 16,
          paddingTop: 16,
          borderTop: "2px solid var(--hairline-soft)",
        }}
      >
        <div
          style={{
            background: "var(--surface-soft)",
            borderRadius: 12,
            padding: "12px 16px",
          }}
        >
          <div className="t-uppercase-tag muted" style={{ marginBottom: 4 }}>
            {t("activityPlusTransport")}
          </div>
          <div className="t-display-sm ink">
            {money(costedDay.subtotalKRW, locale)}
          </div>
          <div className="t-caption-sm muted" style={{ marginTop: 2 }}>
            {t("perPerson")}
          </div>
        </div>
        {costedDay.lodging && (
          <div
            style={{
              background: "var(--primary-light)",
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            <div
              className="t-uppercase-tag"
              style={{ marginBottom: 4, color: "var(--primary)" }}
            >
              {t("inclLodging", { stars: costedDay.lodging.stars })}
            </div>
            <div className="t-display-sm" style={{ color: "var(--primary)" }}>
              {money(costedDay.totalKRW, locale)}
            </div>
            <div className="t-caption-sm muted" style={{ marginTop: 2 }}>
              {t("oneNight")}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function GrandTotalCard({ costed }: { costed: CostedPlan }) {
  const t = useTranslations("planner.canvas.cost")
  const locale = useLocale()
  return (
    <div
      style={{
        marginTop: 32,
        borderRadius: 18,
        padding: "24px 28px",
        background:
          "linear-gradient(135deg, var(--primary-dark), var(--primary))",
        color: "var(--on-primary)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          className="t-uppercase-tag"
          style={{ color: "var(--on-primary-muted)", marginBottom: 6 }}
        >
          {t("grandTitle", { count: costed.days.length })}
        </div>
        <div className="t-display-lg" style={{ color: "var(--on-primary)" }}>
          {money(costed.grandTotalKRW, locale)}
        </div>
        <div
          className="t-body-sm"
          style={{ color: "var(--on-primary-muted)", marginTop: 4 }}
        >
          {t("grandSub")}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {costed.days.map((d, i) => (
          <div
            key={d.day.id}
            className="t-body-sm"
            style={{ color: "var(--on-primary-muted)", marginBottom: 4 }}
          >
            {t("dayLine", { n: i + 1 })}:{" "}
            <strong style={{ color: "var(--on-primary)" }}>
              {money(d.totalKRW, locale)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}
