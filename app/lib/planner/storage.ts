import type { Plan } from "./types"

const STORAGE_KEY = "handled:plans"

const isBrowser = (): boolean => typeof window !== "undefined"

const readAll = (): Plan[] => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Plan[]) : []
  } catch {
    return []
  }
}

const writeAll = (plans: Plan[]): void => {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  } catch {
    // quota exceeded or serialization failure — silently drop in prototype
  }
}

export const listPlans = (): Plan[] =>
  readAll().sort((a, b) => b.updatedAt - a.updatedAt)

export const getPlan = (id: string): Plan | undefined =>
  readAll().find((p) => p.id === id)

export const savePlan = (plan: Plan): Plan => {
  const all = readAll()
  const next = { ...plan, updatedAt: Date.now() }
  const idx = all.findIndex((p) => p.id === plan.id)
  if (idx >= 0) all[idx] = next
  else all.push(next)
  writeAll(all)
  return next
}

export const removePlan = (id: string): void => {
  writeAll(readAll().filter((p) => p.id !== id))
}

export const clearPlans = (): void => writeAll([])
