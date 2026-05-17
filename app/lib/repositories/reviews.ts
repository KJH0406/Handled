import { HOME_REVIEWS, REVIEWS_BY_GUIDE } from "../data/reviews"
import type { HomeReview, Review } from "../types/domain"

export const reviewsRepo = {
  listByGuideId: (guideId: string): Review[] => REVIEWS_BY_GUIDE[guideId] ?? [],

  listHome: (): HomeReview[] => HOME_REVIEWS,
}
