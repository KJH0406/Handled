import type { ExperienceCategory, StoryCategory } from "../types/domain"

/**
 * Category color system — single source of truth.
 *
 * Every category (Experience + Story) maps to ONE muted, on-brand-adjacent hue.
 * This is the reconciled, collision-free replacement for the ad-hoc badge colors
 * (#fff / rgba(34,34,34,.85) / var(--ink)) that gave every category the same look.
 *
 * Each entry exposes two treatments so a badge stays legible in both contexts:
 *  - `solid`  — saturated, dark enough for WHITE text. Used for badges OVER photos
 *               (exp card, story card, featured) where a light tint would clash.
 *  - `softBg` — very light tint. Paired with `solid` as the text color for badges
 *               on a WHITE surface (detail-page pills, latest-row tags).
 *
 * All `white-on-solid` and `solid-on-softBg` pairs are verified ≥ 4.5:1 (WCAG 1.4.3).
 * Brand anchors are preserved: Urban = Classic Blue (--primary), Food = coral family.
 * Category palettes are inherently multi-hue data (cf. CAT_FALLBACK), so they live
 * here as a typed map rather than as :root brand tokens — keep all category color
 * here, never re-hardcode a category hex in a component.
 */
export interface CategoryColor {
  /** Saturated bg for over-photo badges (white text). */
  solid: string
  /** Light tint bg for on-white badges (text = `solid`). */
  softBg: string
}

export const CATEGORY_COLOR: Record<
  ExperienceCategory | StoryCategory,
  CategoryColor
> = {
  // ── Experience categories ──
  Food: { solid: "#c0413a", softBg: "#fdeeea" }, // coral red (brand coral family)
  Shopping: { solid: "#b3265c", softBg: "#fbe9f0" }, // raspberry
  Culture: { solid: "#4338ca", softBg: "#ebecfb" }, // indigo
  Architecture: { solid: "#475569", softBg: "#eef1f5" }, // slate
  Art: { solid: "#9a4708", softBg: "#fbefdd" }, // amber (darkened for white text)
  Nightlife: { solid: "#6d28d9", softBg: "#f0eafc" }, // violet
  Photo: { solid: "#4b5b70", softBg: "#eef1f5" }, // steel blue-gray
  Beach: { solid: "#0e7490", softBg: "#e3f2f8" }, // cyan (darkened)
  Nature: { solid: "#136c34", softBg: "#e6f4ec" }, // forest green
  Traditional: { solid: "#9a3412", softBg: "#fbeae1" }, // terracotta
  Urban: { solid: "#0f4c81", softBg: "#e8f0fb" }, // Classic Blue (--primary)

  // ── Story-only categories ──
  "Travel Tips": { solid: "#0f766e", softBg: "#e1f1ef" }, // teal
  Neighborhoods: { solid: "#a21caf", softBg: "#f8e8f9" }, // fuchsia
  Destinations: { solid: "#0369a1", softBg: "#e3eef8" }, // sky blue
}

const FALLBACK: CategoryColor = { solid: "#475569", softBg: "#eef1f5" }

export const categoryColor = (c: string): CategoryColor =>
  CATEGORY_COLOR[c as ExperienceCategory | StoryCategory] ?? FALLBACK
