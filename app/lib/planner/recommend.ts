import { experiencesRepo } from "../repositories/experiences"
import type { Experience } from "../types/domain"
import type { PlanInput } from "./types"

export const recommendExperiences = (
  input: PlanInput,
  limit: number = 6,
): Experience[] => {
  const inCity = experiencesRepo.list({ city: input.city })
  const interests = new Set(input.interests)

  const scored = inCity.map((e) => ({
    e,
    score: interests.has(e.category) ? 1 : 0,
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.e)
}
