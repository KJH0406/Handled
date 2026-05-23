import type { City, ExperienceCategory } from "../types/domain"

export type SlotTimeOfDay = "morning" | "lunch" | "afternoon" | "evening"

export type TourClass = "first" | "business" | "economy"

export const BUDGET_MIN = 1000
export const BUDGET_MAX = 30000
export const BUDGET_STEP = 500
export const BUDGET_DEFAULT = 5000
export const SPECIAL_REQUESTS_MAX = 150

export interface PlanInput {
  city: City
  startDate: string
  endDate: string
  adults: number
  teens: number
  kids: number
  interests: ExperienceCategory[]
  tourClass?: TourClass
  budget?: number
  specialRequests?: string
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
