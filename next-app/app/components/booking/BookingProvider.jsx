"use client"

import { createContext, useContext, useEffect, useState } from "react"

const BookingContext = createContext(null)
const STORAGE_KEY = "handled.booking"

export function BookingProvider({ children }) {
  const [booking, setBookingState] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setBookingState(JSON.parse(raw))
    } catch {
      // sessionStorage blocked or JSON parse failed — start with null
    }
    setHydrated(true)
  }, [])

  const setBooking = (next) => {
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

const FALLBACK = { booking: null, setBooking: () => {}, hydrated: false }

export function useBooking() {
  const ctx = useContext(BookingContext)
  // During prerender / SSG the Provider's value may not be present yet.
  // Fall back to a safe default so screens can render their empty state.
  return ctx ?? FALLBACK
}
