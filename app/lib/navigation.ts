"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

type SearchParamValue = string | number | undefined | null

const buildSearch = (params: Record<string, SearchParamValue>): string => {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && v !== "All",
  )
  if (entries.length === 0) return ""
  const usp = new URLSearchParams()
  for (const [k, v] of entries) usp.set(k, String(v))
  return `?${usp.toString()}`
}

export interface ListRouteParams {
  initialCity?: string
  initialQuery?: string
}

export interface ExperiencesRouteParams {
  initialCity?: string
  initialCategory?: string
  initialQuery?: string
}

export interface ProfileRouteParams {
  guideId: string
}

export interface ExperienceRouteParams {
  expId: string
}

export interface PlanRouteParams {
  planId: string
}

export interface PlanNewRouteParams {
  initialCity?: string
  initialStart?: string
  initialEnd?: string
}

export interface SignInRouteParams {
  /** Route name to navigate to after a successful sign-in. */
  next?: RouteName
}

export type RouteParamsByName = {
  home: void
  list: ListRouteParams | void
  experiences: ExperiencesRouteParams | void
  profile: ProfileRouteParams
  experience: ExperienceRouteParams
  payment: void
  confirm: void
  planNew: PlanNewRouteParams | void
  plan: PlanRouteParams
  myPlans: void
  signIn: SignInRouteParams | void
  signUp: void
}

export type RouteName = keyof RouteParamsByName

type RouteBuilder<P> = (params: P) => string

const ROUTE_BUILDERS: { [K in RouteName]: RouteBuilder<RouteParamsByName[K]> } =
  {
    home: () => "/",
    list: (params) => {
      const { initialCity, initialQuery } = (params ?? {}) as ListRouteParams
      return `/guides${buildSearch({ city: initialCity, q: initialQuery })}`
    },
    experiences: (params) => {
      const { initialCity, initialCategory, initialQuery } = (params ??
        {}) as ExperiencesRouteParams
      return `/experiences${buildSearch({
        city: initialCity,
        category: initialCategory,
        q: initialQuery,
      })}`
    },
    profile: ({ guideId }) => `/guides/${guideId}`,
    experience: ({ expId }) => `/experiences/${expId}`,
    payment: () => "/checkout",
    confirm: () => "/checkout/confirmed",
    planNew: (params) => {
      const { initialCity, initialStart, initialEnd } = (params ??
        {}) as PlanNewRouteParams
      return `/plan/new${buildSearch({
        city: initialCity,
        start: initialStart,
        end: initialEnd,
      })}`
    },
    plan: ({ planId }) => `/plan/${planId}`,
    myPlans: () => "/my-plans",
    signIn: (params) => {
      const { next } = (params ?? {}) as SignInRouteParams
      return `/sign-in${buildSearch({ next })}`
    },
    signUp: () => "/sign-up",
  }

export type AppNavigate = <K extends RouteName>(
  name: K,
  ...args: RouteParamsByName[K] extends void
    ? [params?: RouteParamsByName[K]]
    : [params: RouteParamsByName[K]]
) => void

export function useAppNavigate(): AppNavigate {
  const router = useRouter()
  return useCallback<AppNavigate>(
    (name, ...args) => {
      const params = args[0]
      const build = ROUTE_BUILDERS[name] as RouteBuilder<unknown>
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
