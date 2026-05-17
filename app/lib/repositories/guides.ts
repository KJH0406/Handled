import { GUIDES } from "../data/guides"
import type { Guide } from "../types/domain"

export interface GuideFilters {
  city?: string
  style?: string
  language?: string
  query?: string
}

export const guidesRepo = {
  findById: (id: string): Guide | null =>
    GUIDES.find((g) => g.id === id) ?? null,

  list: (filters: GuideFilters = {}): Guide[] => {
    const { city, style, language, query } = filters
    return GUIDES.filter((g) => {
      if (city && city !== "All" && g.city !== city) return false
      if (style && style !== "All" && !g.styles.includes(style)) return false
      if (
        language &&
        language !== "All" &&
        !g.languages.includes(language as Guide["languages"][number])
      )
        return false
      if (query) {
        const matches =
          g.name.includes(query) ||
          g.city.includes(query) ||
          g.district.includes(query) ||
          g.styles.some((s) => s.includes(query)) ||
          g.oneLiner.includes(query)
        if (!matches) return false
      }
      return true
    })
  },
}
