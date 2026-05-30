import { STORIES } from "../data/stories"
import type { Story, StoryCategory } from "../types/domain"

export interface StoryFilters {
  category?: string
}

export const storiesRepo = {
  findById: (id: string): Story | null =>
    STORIES.find((s) => s.id === id) ?? null,

  featured: (): Story | null => STORIES.find((s) => s.featured) ?? null,

  list: (filters: StoryFilters = {}): Story[] => {
    const { category } = filters
    return STORIES.filter((s) => {
      if (category && category !== "All" && s.category !== category)
        return false
      return true
    })
  },

  latest: (limit: number = 3, excludeId?: string): Story[] =>
    STORIES.filter((s) => s.id !== excludeId).slice(0, limit),

  related: (story: Story, limit: number = 3): Story[] =>
    STORIES.filter(
      (s) => s.id !== story.id && s.category === story.category,
    ).concat(
      STORIES.filter(
        (s) => s.id !== story.id && s.category !== story.category,
      ),
    ).slice(0, limit),
}

export type { StoryCategory }
