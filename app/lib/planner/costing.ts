import type { ExperienceCategory } from "../types/domain"
import {
  planDayCount,
  type Plan,
  type PlanDay,
  type PlanSlot,
  type Transport,
} from "./types"

/**
 * Representative cost model for a generated plan.
 *
 * Costs are NOT stored on the Plan — they are derived deterministically here at
 * render time from data the plan already holds (category, indices, party size,
 * chosen transport, budget tier). This keeps localStorage plans migration-free:
 * a plan saved before this feature still renders full costs. When the real
 * product has the AI populate these numbers, it can emit the same shapes.
 *
 * All amounts are KRW per person (KRW is the app's canonical unit; display layer
 * converts to USD via `money()`). Numbers are plausible estimates, not quotes.
 */

export type CostNoteKey =
  | "dining"
  | "shopping"
  | "admission"
  | "experience"
  | "activity"
  | "free"

export type BudgetTier = "low" | "mid" | "high"

export interface CostedTransit {
  mode: Transport
  durationMin: number
  costKRW: number
  /** Private car is bundled with the service → shown as "included", not a fare. */
  included: boolean
  /** Previous stop's name / area / station, when known. */
  fromName?: string
  fromArea?: string
  fromStation?: string
  /** This stop's name / area / station, when known. */
  toName?: string
  toArea?: string
  toStation?: string
  /** Representative subway line for this leg (public transit only). */
  line?: string
  /** Short same-area hop shown as a walk (🚶), no fare. */
  walk?: boolean
}

export interface CostedSlot {
  slot: PlanSlot
  costKRW: number
  noteKey: CostNoteKey
  /** Leg from the previous stop to this one. Null for the first stop of a day. */
  transit: CostedTransit | null
}

export interface CostedLodging {
  name: string
  area: string
  stars: number
  nightlyKRW: number
  tier: BudgetTier
}

export interface CostedDay {
  day: PlanDay
  slots: CostedSlot[]
  /** Null on the final (check-out) night and on single-day trips. */
  lodging: CostedLodging | null
  activityKRW: number
  transitKRW: number
  /** activity + transit. */
  subtotalKRW: number
  /** subtotal + lodging. */
  totalKRW: number
}

export interface CostedPlan {
  transport: Transport
  days: CostedDay[]
  /** Per person, across all days (activities + transport + lodging). */
  grandTotalKRW: number
}

/** Base per-person activity cost (KRW) and the note describing the spend. */
const ACTIVITY_COST: Record<
  ExperienceCategory,
  { krw: number; note: CostNoteKey }
> = {
  Food: { krw: 18_000, note: "dining" },
  Shopping: { krw: 40_000, note: "shopping" },
  Culture: { krw: 8_000, note: "admission" },
  Architecture: { krw: 0, note: "free" },
  Art: { krw: 12_000, note: "admission" },
  Nightlife: { krw: 35_000, note: "dining" },
  Photo: { krw: 0, note: "free" },
  Beach: { krw: 6_000, note: "activity" },
  Nature: { krw: 4_000, note: "admission" },
  Traditional: { krw: 25_000, note: "experience" },
  Urban: { krw: 10_000, note: "activity" },
  KPop: { krw: 30_000, note: "experience" },
  Beauty: { krw: 45_000, note: "experience" },
}

const TIER_ACTIVITY_MULT: Record<BudgetTier, number> = {
  low: 0.8,
  mid: 1,
  high: 1.4,
}

const TIER_LODGING: Record<BudgetTier, { stars: number; nightlyKRW: number }> =
  {
    low: { stars: 3, nightlyKRW: 90_000 },
    mid: { stars: 4, nightlyKRW: 150_000 },
    high: { stars: 5, nightlyKRW: 300_000 },
  }

/** Representative hotel pools per city (proper nouns; shared across locales). */
const HOTELS: Record<string, ReadonlyArray<{ name: string; area: string }>> = {
  Seoul: [
    { name: "Myeongdong Central Hotel", area: "Myeongdong" },
    { name: "Jongno Heritage Stay", area: "Jongno" },
    { name: "Gangnam Boutique Hotel", area: "Gangnam" },
  ],
  Busan: [
    { name: "Haeundae Bay Hotel", area: "Haeundae" },
    { name: "Seomyeon City Hotel", area: "Seomyeon" },
    { name: "Gwangalli Seaside Stay", area: "Gwangalli" },
  ],
  Jeju: [
    { name: "Jeju City Resort", area: "Jeju City" },
    { name: "Seogwipo Ocean Hotel", area: "Seogwipo" },
    { name: "Jungmun Beach Resort", area: "Jungmun" },
  ],
  Incheon: [
    { name: "Songdo Central Hotel", area: "Songdo" },
    { name: "Wolmido Bay Hotel", area: "Wolmido" },
    { name: "Yeongjong Airport Hotel", area: "Yeongjong" },
  ],
}

const roundTo = (n: number, step: number): number => Math.round(n / step) * step

const tierFor = (plan: Plan): BudgetTier => {
  const { budget, adults, teens } = plan.input
  if (!budget) return "mid"
  const people = Math.max(1, adults + teens)
  const days = planDayCount(plan.input)
  const perPersonPerDay = budget / (people * days)
  // Floor is ~100k/person/day, ceiling ~500k; the wizard default (~130k) → mid.
  if (perPersonPerDay <= 120_000) return "low"
  if (perPersonPerDay <= 300_000) return "mid"
  return "high"
}

const activityCost = (
  category: ExperienceCategory,
  tier: BudgetTier,
  slotIdx: number,
): { costKRW: number; noteKey: CostNoteKey } => {
  const base = ACTIVITY_COST[category] ?? { krw: 10_000, note: "activity" }
  if (base.krw === 0) return { costKRW: 0, noteKey: "free" }
  // Small deterministic jitter so repeated categories differ slightly.
  const jitter = (slotIdx % 3) * 500
  const krw = roundTo(base.krw * TIER_ACTIVITY_MULT[tier] + jitter, 500)
  return { costKRW: krw, noteKey: base.note }
}

const buildTransit = (
  mode: Transport,
  dayIdx: number,
  slotIdx: number,
  fromSlot: PlanSlot | undefined,
  toSlot: PlanSlot,
): CostedTransit => {
  const seed = dayIdx * 4 + slotIdx
  const ends = {
    fromName: fromSlot?.title,
    fromArea: fromSlot?.area,
    fromStation: fromSlot?.station,
    toName: toSlot.title,
    toArea: toSlot.area,
    toStation: toSlot.station,
  }
  const line = toSlot.line
  const sameArea = !!fromSlot?.area && fromSlot.area === toSlot.area

  if (mode === "car") {
    return {
      mode,
      durationMin: 8 + (seed % 4) * 2,
      costKRW: 0,
      included: true,
      ...ends,
    }
  }
  if (mode === "taxi") {
    return {
      mode,
      durationMin: 6 + ((seed * 5) % 14),
      costKRW: roundTo(4_000 + (seed % 5) * 1_500, 500),
      included: false,
      ...ends,
    }
  }
  // public transit — same locality is a walk; otherwise a flat-fare subway/bus
  // leg with a representative line badge.
  const walk = sameArea || seed % 3 === 0
  return {
    mode,
    durationMin: walk ? 6 + (seed % 4) * 2 : 12 + ((seed * 7) % 24),
    costKRW: walk ? 0 : 1_500,
    included: false,
    ...ends,
    line: walk ? undefined : line,
    walk,
  }
}

const buildLodging = (
  plan: Plan,
  tier: BudgetTier,
  dayIdx: number,
): CostedLodging => {
  const pool = HOTELS[plan.input.city] ?? [
    { name: `${plan.input.city} Central Hotel`, area: plan.input.city },
  ]
  const pick = pool[dayIdx % pool.length]
  const { stars, nightlyKRW } = TIER_LODGING[tier]
  return { ...pick, stars, nightlyKRW, tier }
}

const costDay = (
  plan: Plan,
  day: PlanDay,
  dayIdx: number,
  tier: BudgetTier,
  transport: Transport,
  isLastNight: boolean,
  partySize: number,
): CostedDay => {
  const slots: CostedSlot[] = day.slots.map((slot, slotIdx) => {
    const { costKRW, noteKey } = activityCost(slot.category, tier, slotIdx)
    const rawTransit =
      slotIdx === 0
        ? null
        : buildTransit(transport, dayIdx, slotIdx, day.slots[slotIdx - 1], slot)
    // Activity and transit read as per-head spend → scale to the whole party.
    // Lodging is a per-room/night figure, so it is left as-is downstream.
    const transit =
      rawTransit && !rawTransit.included
        ? { ...rawTransit, costKRW: rawTransit.costKRW * partySize }
        : rawTransit
    return { slot, costKRW: costKRW * partySize, noteKey, transit }
  })

  const activityKRW = slots.reduce((s, c) => s + c.costKRW, 0)
  const transitKRW = slots.reduce(
    (s, c) => s + (c.transit && !c.transit.included ? c.transit.costKRW : 0),
    0,
  )
  const lodging = isLastNight ? null : buildLodging(plan, tier, dayIdx)
  const subtotalKRW = activityKRW + transitKRW
  const totalKRW = subtotalKRW + (lodging?.nightlyKRW ?? 0)

  return {
    day,
    slots,
    lodging,
    activityKRW,
    transitKRW,
    subtotalKRW,
    totalKRW,
  }
}

export const costPlan = (plan: Plan): CostedPlan => {
  const tier = tierFor(plan)
  const transport: Transport = plan.input.transport ?? "public"
  const lastIdx = plan.days.length - 1
  const partySize = Math.max(
    1,
    plan.input.adults + plan.input.teens + plan.input.kids,
  )

  const days = plan.days.map((day, dayIdx) =>
    costDay(plan, day, dayIdx, tier, transport, dayIdx === lastIdx, partySize),
  )

  const grandTotalKRW = days.reduce((s, d) => s + d.totalKRW, 0)
  return { transport, days, grandTotalKRW }
}
