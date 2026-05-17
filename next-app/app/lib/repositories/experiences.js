import { EXPERIENCES } from "../data/experiences"
import { guidesRepo } from "./guides"

/**
 * @typedef {Object} ExperienceFilters
 * @property {string} [city]     — "All" or city name (resolved via guide)
 * @property {string} [category] — "All" or category tag
 * @property {string} [query]    — free-text search (case-sensitive substring)
 */

export const experiencesRepo = {
  findById: (id) => EXPERIENCES.find((e) => e.id === id) ?? null,

  listByGuideId: (guideId) =>
    EXPERIENCES.filter((e) => e.guideId === guideId),

  list: (filters = {}) => {
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

  featured: (limit = 3) => EXPERIENCES.slice(0, limit),
}
