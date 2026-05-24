"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export interface AuthUser {
  email: string
  name: string
}

interface AuthContextValue {
  user: AuthUser | null
  signIn: (user: AuthUser) => void
  signOut: () => void
  hydrated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = "handled.user"

const reviveUser = (raw: unknown): AuthUser | null => {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>
  if (typeof obj.email !== "string" || obj.email.length === 0) return null
  return {
    email: obj.email,
    name: typeof obj.name === "string" ? obj.name : obj.email,
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

  const signIn = (next: AuthUser) => {
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
