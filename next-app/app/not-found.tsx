import type { Metadata } from "next"
import Link from "next/link"
import Icon from "./components/ui/Icon"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <main className="fade-in">
      <div className="container status-page">
        <div className="status-page__icon">
          <Icon name="search" size={32} stroke="var(--muted)" />
        </div>
        <h1 className="t-display-md ink mb-base">Page not found</h1>
        <p className="t-body-md muted">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="status-page__actions">
          <Link className="btn btn-primary" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
