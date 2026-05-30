import type { CategoryFallback, ExperienceCategory } from "../types/domain"

/**
 * Category fallback gradients — used when an experience card has no photo.
 * Re-seeded from Airbnb sub-brand references (Luxe / Plus / Rausch) to
 * thematic palettes that read alongside Classic Blue + Deep Coral.
 */
export const CAT_FALLBACK: Record<ExperienceCategory, CategoryFallback> = {
  // Food — warm coral wash (brand coral family)
  Food: { emoji: "🍜", bg: "linear-gradient(135deg, #c0413a, #f08a86)" },
  // Shopping — deep wine to raspberry (premium, no Plus magenta)
  Shopping: {
    emoji: "🛍️",
    bg: "linear-gradient(135deg, #7a1b3d, #b9265c)",
  },
  // Culture — deep indigo to violet (no Luxe purple reference)
  Culture: {
    emoji: "🎎",
    bg: "linear-gradient(135deg, #2a1a6f, #6d28d9)",
  },
  // Architecture — slate-noir (kept)
  Architecture: {
    emoji: "🏛",
    bg: "linear-gradient(135deg, #0a0e27, #4a5568)",
  },
  // Art — amber-gold (kept)
  Art: { emoji: "🎨", bg: "linear-gradient(135deg, #d97706, #f59e0b)" },
  // Nightlife — indigo dusk (kept)
  Nightlife: {
    emoji: "🍸",
    bg: "linear-gradient(135deg, #1e293b, #6366f1)",
  },
  // Photo — neutral slate (kept)
  Photo: { emoji: "📸", bg: "linear-gradient(135deg, #475569, #94a3b8)" },
  // Beach — sea cyan (kept)
  Beach: { emoji: "🏖", bg: "linear-gradient(135deg, #0891b2, #38bdf8)" },
  // Nature — forest green (kept)
  Nature: {
    emoji: "🌋",
    bg: "linear-gradient(135deg, #166534, #22c55e)",
  },
  // Traditional — earthy hanbok terracotta (distinct from brand coral)
  Traditional: {
    emoji: "👘",
    bg: "linear-gradient(135deg, #7c2d12, #c2410c)",
  },
  // Urban — city navy to sky (kept)
  Urban: { emoji: "🌆", bg: "linear-gradient(135deg, #1e40af, #38bdf8)" },
}
