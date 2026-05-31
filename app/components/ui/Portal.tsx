"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

/**
 * Renders children into document.body so overlays (modals) escape any
 * positioned/sticky/overflow ancestor and cover the full viewport. Renders
 * nothing until mounted to stay SSR-safe.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, document.body)
}
