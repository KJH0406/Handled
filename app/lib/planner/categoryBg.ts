import type { ExperienceCategory } from "../types/domain"

const BG: Record<ExperienceCategory, string> = {
  Food: "#fff1ea",
  Shopping: "#fff0f6",
  Culture: "#f3eefe",
  Architecture: "#f1f5f9",
  Art: "#ecfdf5",
  Nightlife: "#ede9fe",
  Photo: "#fdf2f8",
  Beach: "#eff6ff",
  Nature: "#ecfdf5",
  Traditional: "#fef3c7",
  Urban: "#f1f5f9",
}

export const categoryBg = (c: ExperienceCategory): string =>
  BG[c] ?? "var(--surface-soft, #f7f7f7)"
