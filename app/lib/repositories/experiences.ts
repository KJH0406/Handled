import { EXPERIENCES } from "../data/experiences"
import type { Experience } from "../types/domain"
import { guidesRepo } from "./guides"

export interface ExperienceFilters {
  city?: string
  category?: string
  query?: string
}

export const experiencesRepo = {
  findById: (id: string): Experience | null =>
    EXPERIENCES.find((e) => e.id === id) ?? null,

  listByGuideId: (guideId: string): Experience[] =>
    EXPERIENCES.filter((e) => e.guideId === guideId),

  list: (filters: ExperienceFilters = {}): Experience[] => {
    const { city, category, query } = filters
    return EXPERIENCES.filter((e) => {
      const guide = guidesRepo.findById(e.guideId)
      if (!guide) return false
      if (city && city !== "All" && guide.city !== city) return false
      if (category && category !== "All" && e.category !== category)
        return false
      if (query) {
        const matches =
          e.title.includes(query) ||
          e.summary.includes(query) ||
          e.category.includes(query) ||
          guide.name.includes(query) ||
          guide.city.includes(query)
        if (!matches) return false
      }
      return true
    })
  },

  featured: (limit: number = 3): Experience[] => EXPERIENCES.slice(0, limit),
}
