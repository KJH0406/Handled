"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

/** Itinerary credits granted to every new account. */
export const DEFAULT_CREDITS = 3

export interface AuthUser {
  email: string
  name: string
  /** Remaining itinerary-generation credits, counted in whole units. */
  credits: number
}

interface AuthContextValue {
  user: AuthUser | null
  signIn: (user: SignInInput) => void
  signOut: () => void
  hydrated: boolean
}

/** New accounts may omit credits; they default to {@link DEFAULT_CREDITS}. */
export type SignInInput = Omit<AuthUser, "credits"> & { credits?: number }

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = "handled.user"

const reviveUser = (raw: unknown): AuthUser | null => {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>
  if (typeof obj.email !== "string" || obj.email.length === 0) return null
  return {
    email: obj.email,
    name: typeof obj.name === "string" ? obj.name : obj.email,
    credits:
      typeof obj.credits === "number" && Number.isFinite(obj.credits)
        ? obj.credits
        : DEFAULT_CREDITS,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUserState(reviveUser(JSON.parse(raw)))
    } catch {
      // localStorage blocked or JSON parse failed - start signed out
    }
    setHydrated(true)
  }, [])

  const signIn = (input: SignInInput) => {
    const next: AuthUser = {
      ...input,
      credits: input.credits ?? DEFAULT_CREDITS,
    }
    setUserState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage failures - in-memory state still works
    }
  }

  const signOut = () => {
    setUserState(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage failures - in-memory state still works
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, hydrated }}>
      {children}
    </AuthContext.Provider>
  )
}

const FALLBACK: AuthContextValue = {
  user: null,
  signIn: () => {},
  signOut: () => {},
  hydrated: false,
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  return ctx ?? FALLBACK
}
