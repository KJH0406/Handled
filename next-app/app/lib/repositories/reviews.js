import { REVIEWS_BY_GUIDE, HOME_REVIEWS } from "../data/reviews"

export const reviewsRepo = {
  listByGuideId: (guideId) => REVIEWS_BY_GUIDE[guideId] || [],

  listHome: () => HOME_REVIEWS,
}
