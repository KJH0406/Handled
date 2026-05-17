import { GUIDES } from "../data/guides"

/**
 * @typedef {Object} GuideFilters
 * @property {string} [city]      — "All" or city name
 * @property {string} [style]     — "All" or style tag
 * @property {string} [language]  — "All" or language
 * @property {string} [query]     — free-text search (case-sensitive substring,
 *                                  matching legacy `String.prototype.includes` behavior)
 */

export const guidesRepo = {
  findById: (id) => GUIDES.find((g) => g.id === id) ?? null,

  list: (filters = {}) => {
    const { city, style, language, query } = filters
    return GUIDES.filter((g) => {
      if (city && city !== "All" && g.city !== city) return false
      if (style && style !== "All" && !g.styles.includes(style)) return false
      if (
        language &&
        language !== "All" &&
        !g.languages.includes(language)
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
