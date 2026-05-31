/**
 * Manual consultation requests collected from the experience detail page while
 * booking is pre-launch. Mirrors lib/planner/storage — a localStorage-backed
 * prototype store keyed by the logged-in user's email + experience id.
 *
 * NOTE: these requests only live in the visitor's browser. For the team to
 * actually receive and follow up on a lead, this needs a real sink (API route,
 * email, or form service) — tracked as a follow-up. See [[project_exp_notify_prelaunch]].
 */
const STORAGE_KEY = "handled:consultations"

export interface ConsultationRequest {
  email: string
  experienceId: string
  requestedAt: number
}

const isBrowser = (): boolean => typeof window !== "undefined"

const readAll = (): ConsultationRequest[] => {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ConsultationRequest[]) : []
  } catch {
    return []
  }
}

const writeAll = (items: ConsultationRequest[]): void => {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // quota exceeded or serialization failure - silently drop in prototype
  }
}

export const hasConsultation = (
  email: string,
  experienceId: string,
): boolean =>
  readAll().some(
    (r) => r.email === email && r.experienceId === experienceId,
  )

/** Records a request once; no-op if this user already applied for this experience. */
export const addConsultation = (email: string, experienceId: string): void => {
  if (hasConsultation(email, experienceId)) return
  const all = readAll()
  all.push({ email, experienceId, requestedAt: Date.now() })
  writeAll(all)
}

export const listConsultations = (): ConsultationRequest[] => readAll()
