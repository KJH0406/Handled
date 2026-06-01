import { STORIES } from "../data/stories"
import type { Story, StoryCategory } from "../types/domain"

export interface StoryFilters {
  category?: string
  tag?: string
}

export interface TagCount {
  tag: string
  count: number
}

export const storiesRepo = {
  findById: (id: string): Story | null =>
    STORIES.find((s) => s.id === id) ?? null,

  featured: (): Story | null => STORIES.find((s) => s.featured) ?? null,

  list: (filters: StoryFilters = {}): Story[] => {
    const { category, tag } = filters
    return STORIES.filter((s) => {
      if (category && category !== "All" && s.category !== category)
        return false
      if (tag && !s.tags.includes(tag)) return false
      return true
    })
  },

  /** Unique tags across all stories, sorted by frequency (desc), then alphabetically. */
  allTags: (): TagCount[] => {
    const counts = new Map<string, number>()
    for (const s of STORIES)
      for (const tag of s.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
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
