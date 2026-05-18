import { SCHEDULE_BY_CATEGORY } from "../data/schedules"
import type { ExperienceCategory } from "../types/domain"
import type {
  PartyType,
  Plan,
  PlanDay,
  PlanInput,
  PlanSlot,
  SlotTimeOfDay,
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
    bucket: ["Shopping", "Art", "Urban", "Beach", "Photo"],
  },
  {
    timeOfDay: "evening",
    time: "19:00",
    durationH: 3,
    bucket: ["Nightlife", "Food", "Urban"],
  },
]

const PARTY_EXCLUDES: Record<PartyType, ExperienceCategory[]> = {
  solo: [],
  couple: [],
  friends: [],
  family: ["Nightlife"],
  parents: ["Nightlife", "Beach"],
}

const partyAllows = (
  cat: ExperienceCategory,
  party: PartyType,
): boolean => !PARTY_EXCLUDES[party].includes(cat)

const pickCategory = (
  bucket: ExperienceCategory[],
  interests: ExperienceCategory[],
  party: PartyType,
  used: Set<ExperienceCategory>,
  offset: number,
): ExperienceCategory => {
  const allowed = bucket.filter((c) => partyAllows(c, party))
  const preferred = allowed.filter(
    (c) => interests.includes(c) && !used.has(c),
  )
  if (preferred.length > 0) return preferred[offset % preferred.length]

  const preferredRepeat = allowed.filter((c) => interests.includes(c))
  if (preferredRepeat.length > 0)
    return preferredRepeat[offset % preferredRepeat.length]

  const fallback = allowed.filter((c) => !used.has(c))
  if (fallback.length > 0) return fallback[offset % fallback.length]

  return allowed[offset % allowed.length]
}

const buildSlot = (
  anchor: TimeAnchor,
  category: ExperienceCategory,
  dayIdx: number,
  slotIdx: number,
): PlanSlot => {
  const steps = SCHEDULE_BY_CATEGORY[category]
  const title = steps[0]?.title ?? category
  const note = steps[1]?.desc

  return {
    id: `slot-${dayIdx}-${slotIdx}-${category.toLowerCase()}`,
    time: anchor.time,
    durationH: anchor.durationH,
    timeOfDay: anchor.timeOfDay,
    category,
    title,
    note,
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
      input.interests,
      input.party,
      used,
      rotationOffset + slotIdx,
    )
    used.add(category)
    slots.push(buildSlot(anchor, category, dayIdx, slotIdx))
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
  `${input.city} ${input.days}-day plan`

export const generatePlan = (input: PlanInput): Plan => {
  const days: PlanDay[] = []
  for (let i = 0; i < input.days; i++) {
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
        plan.input.interests,
        plan.input.party,
        used,
        dayIdx + slotIdx + Date.now(),
      )
      return buildSlot(anchor, next, dayIdx, slotIdx)
    })
    return { ...day, slots }
  })
  return { ...plan, days, updatedAt: Date.now() }
}
