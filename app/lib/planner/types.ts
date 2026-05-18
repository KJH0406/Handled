import type { City, ExperienceCategory } from "../types/domain"

export type PartyType = "solo" | "couple" | "friends" | "family" | "parents"

export type SlotTimeOfDay = "morning" | "lunch" | "afternoon" | "evening"

export interface PlanInput {
  city: City
  days: number
  party: PartyType
  partySize: number
  interests: ExperienceCategory[]
  freeNote?: string
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
}
