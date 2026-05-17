"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { Booking } from "../../lib/types/domain"

interface BookingContextValue {
  booking: Booking | null
  setBooking: (next: Booking | null) => void
  hydrated: boolean
}

const BookingContext = createContext<BookingContextValue | null>(null)
const STORAGE_KEY = "handled.booking"

const reviveBooking = (raw: unknown): Booking | null => {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>
  const dateValue = obj.date
  const date =
    dateValue instanceof Date
      ? dateValue
      : typeof dateValue === "string" || typeof dateValue === "number"
        ? new Date(dateValue)
        : null
  if (!date || Number.isNaN(date.getTime())) return null
  return { ...(obj as unknown as Booking), date }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBookingState] = useState<Booking | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setBookingState(reviveBooking(JSON.parse(raw)))
    } catch {
      // sessionStorage blocked or JSON parse failed — start with null
    }
    setHydrated(true)
  }, [])

  const setBooking = (next: Booking | null) => {
    setBookingState(next)
    try {
      if (next) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage failures — in-memory state still works
    }
  }

  return (
    <BookingContext.Provider value={{ booking, setBooking, hydrated }}>
      {children}
    </BookingContext.Provider>
  )
}

const FALLBACK: BookingContextValue = {
  booking: null,
  setBooking: () => {},
  hydrated: false,
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  return ctx ?? FALLBACK
}
