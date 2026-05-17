export const TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const

export const INTEREST_TAGS = [
  "Food",
  "Culture",
  "Nature",
  "Shopping",
  "History",
  "Photo",
  "Nightlife",
  "Hanbok",
  "Architecture",
] as const

export type BookingTime = (typeof TIMES)[number]
export type InterestTag = (typeof INTEREST_TAGS)[number]
