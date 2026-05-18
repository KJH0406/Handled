import type { City, ExperienceCategory } from "../types/domain"

export interface ParsedPrompt {
  city?: City
  days?: number
  interests: ExperienceCategory[]
}

const CITY_PATTERNS: ReadonlyArray<[RegExp, City]> = [
  [/\bseoul\b|서울/i, "Seoul"],
  [/\bbusan\b|부산/i, "Busan"],
  [/\bjeju\b|제주/i, "Jeju"],
  [/\bincheon\b|인천/i, "Incheon"],
]

const INTEREST_PATTERNS: ReadonlyArray<[RegExp, ExperienceCategory]> = [
  [/\bfood(s|ie|ies)?\b|\beat(ing)?\b|맛집|미식/i, "Food"],
  [/\bphoto(graphy|s)?\b|사진|포토/i, "Photo"],
  [/\bculture|cultural\b|문화/i, "Culture"],
  [/\bshopping\b|쇼핑/i, "Shopping"],
  [/\bnightlife|bar|club\b|야경|밤|클럽/i, "Nightlife"],
  [/\barchitecture\b|건축/i, "Architecture"],
  [/\bart\b|미술|아트/i, "Art"],
  [/\bnature|hike|hiking|park\b|자연|등산/i, "Nature"],
  [/\bbeach\b|해변|바다/i, "Beach"],
  [/\btraditional|hanok|temple\b|전통|한옥|템플/i, "Traditional"],
  [/\burban|city walk|street\b|도심|시내/i, "Urban"],
]

const extractDays = (text: string): number | undefined => {
  const weekend = /\bweekend\b|주말/i.test(text)
  if (weekend) return 2
  const m = text.match(/(\d+)\s*(?:days?|nights?|일|박)/i)
  if (m) {
    const n = parseInt(m[1], 10)
    if (n >= 1 && n <= 21) return n
  }
  return undefined
}

export const parsePrompt = (raw: string): ParsedPrompt => {
  const text = raw.trim()
  if (!text) return { interests: [] }

  let city: City | undefined
  for (const [re, c] of CITY_PATTERNS) {
    if (re.test(text)) {
      city = c
      break
    }
  }

  const interests: ExperienceCategory[] = []
  for (const [re, cat] of INTEREST_PATTERNS) {
    if (re.test(text) && !interests.includes(cat)) interests.push(cat)
  }

  return {
    city,
    days: extractDays(text),
    interests,
  }
}
