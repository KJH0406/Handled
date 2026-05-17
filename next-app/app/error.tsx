"use client"

import Link from "next/link"
import { useEffect } from "react"
import Icon from "./components/ui/Icon"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <main className="fade-in">
      <div className="container status-page">
        <div className="status-page__icon">
          <Icon name="x" size={32} stroke="var(--rausch)" sw={2.5} />
        </div>
        <h1 className="t-display-md ink mb-base">Something went wrong</h1>
        <p className="t-body-md muted">
          We hit an unexpected error. Please try again.
        </p>
        <div className="status-page__actions">
          <button className="btn btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <Link className="btn btn-secondary" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
