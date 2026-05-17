import type { CategoryFallback, ExperienceCategory } from "../types/domain"

export const CAT_FALLBACK: Record<ExperienceCategory, CategoryFallback> = {
  Food: { emoji: "🍜", bg: "linear-gradient(135deg, #ff385c, #ffa07a)" },
  Shopping: {
    emoji: "🛍️",
    bg: "linear-gradient(135deg, #92174d, #ec4899)",
  },
  Culture: {
    emoji: "🎎",
    bg: "linear-gradient(135deg, #460479, #7c3aed)",
  },
  Architecture: {
    emoji: "🏛",
    bg: "linear-gradient(135deg, #0a0e27, #4a5568)",
  },
  Art: { emoji: "🎨", bg: "linear-gradient(135deg, #d97706, #f59e0b)" },
  Nightlife: {
    emoji: "🍸",
    bg: "linear-gradient(135deg, #1e293b, #6366f1)",
  },
  Photo: { emoji: "📸", bg: "linear-gradient(135deg, #475569, #94a3b8)" },
  Beach: { emoji: "🏖", bg: "linear-gradient(135deg, #0891b2, #38bdf8)" },
  Nature: {
    emoji: "🌋",
    bg: "linear-gradient(135deg, #166534, #22c55e)",
  },
  Traditional: {
    emoji: "👘",
    bg: "linear-gradient(135deg, #b91c1c, #f87171)",
  },
  Urban: { emoji: "🌆", bg: "linear-gradient(135deg, #1e40af, #38bdf8)" },
}
