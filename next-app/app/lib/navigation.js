"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

const buildSearch = (params) => {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && v !== "All",
  )
  if (entries.length === 0) return ""
  const usp = new URLSearchParams()
  for (const [k, v] of entries) usp.set(k, String(v))
  return `?${usp.toString()}`
}

const ROUTE_BUILDERS = {
  home: () => "/",
  list: ({ initialCity, initialQuery } = {}) =>
    `/guides${buildSearch({ city: initialCity, q: initialQuery })}`,
  experiences: ({ initialCity, initialCategory, initialQuery } = {}) =>
    `/experiences${buildSearch({
      city: initialCity,
      category: initialCategory,
      q: initialQuery,
    })}`,
  profile: ({ guideId }) => `/guides/${guideId}`,
  experience: ({ expId }) => `/experiences/${expId}`,
  payment: () => "/checkout",
  confirm: () => "/checkout/confirmed",
}

export function useAppNavigate() {
  const router = useRouter()
  return useCallback(
    (name, params = {}) => {
      const build = ROUTE_BUILDERS[name]
      if (!build) {
        throw new Error(`Unknown route: ${name}`)
      }
      const href = build(params)
      router.push(href)
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" })
      }
    },
    [router],
  )
}
