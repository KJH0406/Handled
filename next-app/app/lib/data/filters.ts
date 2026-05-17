export const CITIES = ["All", "Seoul", "Busan", "Jeju", "Incheon"] as const

export const STYLES = [
  "All",
  "Food",
  "Culture",
  "Nature",
  "Shopping",
  "History",
  "Art",
  "Photo",
  "Nightlife",
] as const

export const LANGUAGES = [
  "All",
  "English",
  "Japanese",
  "Mandarin",
  "French",
] as const

export type CityFilter = (typeof CITIES)[number]
export type StyleFilter = (typeof STYLES)[number]
export type LanguageFilter = (typeof LANGUAGES)[number]
