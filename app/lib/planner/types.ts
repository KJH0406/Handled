import type { City, ExperienceCategory } from "../types/domain"

export type SlotTimeOfDay = "morning" | "lunch" | "afternoon" | "evening"

export type Transport = "public" | "taxi" | "car"

/** Hard upper bound on trip length (days, inclusive). */
export const MAX_TRIP_DAYS = 7

/** Fixed prototype FX rate. KRW is the canonical unit; USD is display-only. */
export const KRW_PER_USD = 1350

/** Per-counted-traveler daily spend assumption used as the floor (KRW). */
export const BUDGET_PER_PERSON_PER_DAY = 100_000

/** Per-counted-traveler daily spend assumption used as the ceiling (KRW). */
export const BUDGET_MAX_PER_PERSON_PER_DAY = 500_000

/** Default sits this fraction above the computed floor. */
export const BUDGET_DEFAULT_MULT = 1.3

/** Slider step in KRW. */
export const BUDGET_STEP = 10_000

interface BudgetFloorInput {
  adults: number
  teens: number
  days: number
}

/**
 * Floor budget in KRW for the given party + duration.
 * Kids are excluded from the counted headcount.
 */
export const computeBudgetMinimum = ({
  adults,
  teens,
  days,
}: BudgetFloorInput): number => {
  const people = adults + teens
  const raw = people * days * BUDGET_PER_PERSON_PER_DAY
  return Math.max(
    BUDGET_STEP,
    Math.ceil(raw / BUDGET_STEP) * BUDGET_STEP,
  )
}

/** Ceiling budget in KRW for the given party + duration (kids excluded). */
export const computeBudgetMaximum = ({
  adults,
  teens,
  days,
}: BudgetFloorInput): number => {
  const people = adults + teens
  const raw = people * days * BUDGET_MAX_PER_PERSON_PER_DAY
  return Math.max(
    BUDGET_STEP,
    Math.ceil(raw / BUDGET_STEP) * BUDGET_STEP,
  )
}

/** Default budget sits BUDGET_DEFAULT_MULT above the floor, snapped to step. */
export const computeBudgetDefault = (input: BudgetFloorInput): number => {
  const floor = computeBudgetMinimum(input)
  const raw = floor * BUDGET_DEFAULT_MULT
  return Math.ceil(raw / BUDGET_STEP) * BUDGET_STEP
}

export interface PlanInput {
  city: City
  startDate: string
  endDate: string
  adults: number
  teens: number
  kids: number
  interests: ExperienceCategory[]
  transport?: Transport
  budget?: number
}

export interface PlanSlot {
  id: string
  time: string
  durationH: number
  timeOfDay: SlotTimeOfDay
  category: ExperienceCategory
  title: string
  note?: string
  locked?: boolean
}

export interface PlanDay {
  id: string
  label: string
  slots: PlanSlot[]
}

export interface Plan {
  id: string
  name: string
  input: PlanInput
  days: PlanDay[]
  createdAt: number
  updatedAt: number
  savedAt?: number
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export const planDayCount = (input: PlanInput): number => {
  const start = Date.parse(input.startDate)
  const end = Date.parse(input.endDate)
  if (Number.isNaN(start) || Number.isNaN(end)) return 1
  const diff = Math.round((end - start) / MS_PER_DAY) + 1
  return Math.max(1, diff)
}

export const planTotalTravelers = (input: PlanInput): number =>
  input.adults + input.teens + input.kids
