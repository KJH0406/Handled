import type { ExperienceCategory } from "../types/domain"

/**
 * Canonical travel-interest options offered in the planner wizard (Step 2).
 * Single source of truth so the home hero mock and the planner never drift.
 * `value` maps to an ExperienceCategory; `label` is the traveler-facing text.
 */
export const TRAVEL_INTERESTS: ReadonlyArray<{
  value: ExperienceCategory
  label: string
}> = [
  { value: "Culture", label: "Culture & History" },
  { value: "Nature", label: "Nature & Adventure" },
  { value: "Food", label: "Food & Dining" },
  { value: "Shopping", label: "Shopping & Design" },
  { value: "Art", label: "Art & Architecture" },
  { value: "KPop", label: "K-Pop & Entertainment" },
  { value: "Beauty", label: "Beauty & Wellness" },
  { value: "Nightlife", label: "Nightlife & Bars" },
] as const

/** Max interests a traveler can select in the planner. */
export const MAX_INTERESTS = 3
