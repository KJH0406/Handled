import { SCHEDULE_BY_CATEGORY } from "../data/schedules"
import { pickVenue } from "../data/venues"
import type { City, ExperienceCategory } from "../types/domain"
import {
  planDayCount,
  type Plan,
  type PlanDay,
  type PlanInput,
  type PlanSlot,
  type SlotTimeOfDay,
} from "./types"

interface TimeAnchor {
  timeOfDay: SlotTimeOfDay
  time: string
  durationH: number
  bucket: ExperienceCategory[]
}

const DAY_TEMPLATE: TimeAnchor[] = [
  {
    timeOfDay: "morning",
    time: "09:30",
    durationH: 3,
    bucket: ["Culture", "Architecture", "Traditional", "Nature", "Photo"],
  },
  {
    timeOfDay: "lunch",
    time: "13:00",
    durationH: 2,
    bucket: ["Food"],
  },
  {
    timeOfDay: "afternoon",
    time: "15:30",
    durationH: 3,
    bucket: ["Shopping", "Art", "Urban", "Beach", "Photo", "Beauty", "KPop"],
  },
  {
    timeOfDay: "evening",
    time: "19:00",
    durationH: 3,
    bucket: ["Nightlife", "Food", "Urban", "KPop"],
  },
]

const excludedCategories = (input: PlanInput): ExperienceCategory[] => {
  const excludes: ExperienceCategory[] = []
  if (input.teens > 0 || input.kids > 0) excludes.push("Nightlife")
  return excludes
}

const pickCategory = (
  bucket: ExperienceCategory[],
  input: PlanInput,
  used: Set<ExperienceCategory>,
  offset: number,
): ExperienceCategory => {
  const excludes = excludedCategories(input)
  const allowed = bucket.filter((c) => !excludes.includes(c))
  const interests = input.interests

  const preferred = allowed.filter(
    (c) => interests.includes(c) && !used.has(c),
  )
  if (preferred.length > 0) return preferred[offset % preferred.length]

  const preferredRepeat = allowed.filter((c) => interests.includes(c))
  if (preferredRepeat.length > 0)
    return preferredRepeat[offset % preferredRepeat.length]

  const fallback = allowed.filter((c) => !used.has(c))
  if (fallback.length > 0) return fallback[offset % fallback.length]

  return allowed[offset % allowed.length] ?? bucket[offset % bucket.length]
}

const buildSlot = (
  anchor: TimeAnchor,
  category: ExperienceCategory,
  dayIdx: number,
  slotIdx: number,
  city: City,
): PlanSlot => {
  // Prefer a real, city-specific venue; fall back to generic schedule steps.
  const venue = pickVenue(city, category, dayIdx + slotIdx)
  const steps = SCHEDULE_BY_CATEGORY[category]
  const title = venue?.name ?? steps[0]?.title ?? category
  const note = venue?.desc ?? steps[1]?.desc

  return {
    id: `slot-${dayIdx}-${slotIdx}-${category.toLowerCase()}`,
    time: anchor.time,
    durationH: anchor.durationH,
    timeOfDay: anchor.timeOfDay,
    category,
    title,
    note,
    area: venue?.area,
    station: venue?.station,
    line: venue?.line,
  }
}

const buildDay = (
  dayIdx: number,
  input: PlanInput,
  rotationOffset: number,
): PlanDay => {
  const slots: PlanSlot[] = []
  const used = new Set<ExperienceCategory>()

  DAY_TEMPLATE.forEach((anchor, slotIdx) => {
    const category = pickCategory(
      anchor.bucket,
      input,
      used,
      rotationOffset + slotIdx,
    )
    used.add(category)
    slots.push(buildSlot(anchor, category, dayIdx, slotIdx, input.city))
  })

  return {
    id: `day-${dayIdx + 1}`,
    label: `Day ${dayIdx + 1}`,
    slots,
  }
}

const createPlanId = (): string =>
  `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const defaultName = (input: PlanInput): string =>
  `${input.city} ${planDayCount(input)}-day plan`

export const generatePlan = (input: PlanInput): Plan => {
  const dayCount = planDayCount(input)
  const days: PlanDay[] = []
  for (let i = 0; i < dayCount; i++) {
    days.push(buildDay(i, input, i))
  }

  const now = Date.now()
  return {
    id: createPlanId(),
    name: defaultName(input),
    input,
    days,
    createdAt: now,
    updatedAt: now,
  }
}

export const regeneratePlan = (plan: Plan): Plan => {
  const lockedByDayIdx: Map<number, PlanSlot[]> = new Map()
  plan.days.forEach((day, idx) => {
    const locked = day.slots.filter((s) => s.locked)
    if (locked.length > 0) lockedByDayIdx.set(idx, locked)
  })

  const fresh = generatePlan(plan.input)

  const mergedDays = fresh.days.map((day, idx) => {
    const locked = lockedByDayIdx.get(idx) ?? []
    if (locked.length === 0) return day
    const lockedSlotIds = new Set(locked.map((s) => s.id))
    const merged = day.slots.map((s) =>
      lockedSlotIds.has(s.id)
        ? (locked.find((l) => l.id === s.id) ?? s)
        : s,
    )
    return { ...day, slots: merged }
  })

  return {
    ...plan,
    days: mergedDays,
    updatedAt: Date.now(),
  }
}

export const regenerateSlot = (
  plan: Plan,
  dayId: string,
  slotId: string,
): Plan => {
  const days = plan.days.map((day) => {
    if (day.id !== dayId) return day
    const slots = day.slots.map((s) => {
      if (s.id !== slotId || s.locked) return s
      const anchor = DAY_TEMPLATE.find((a) => a.timeOfDay === s.timeOfDay)
      if (!anchor) return s
      const dayIdx = plan.days.indexOf(day)
      const slotIdx = day.slots.indexOf(s)
      const used = new Set(
        day.slots.filter((o) => o.id !== s.id).map((o) => o.category),
      )
      const next = pickCategory(
        anchor.bucket,
        plan.input,
        used,
        dayIdx + slotIdx + Date.now(),
      )
      return buildSlot(anchor, next, dayIdx, slotIdx, plan.input.city)
    })
    return { ...day, slots }
  })
  return { ...plan, days, updatedAt: Date.now() }
}
