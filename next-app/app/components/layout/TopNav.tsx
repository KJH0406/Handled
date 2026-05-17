"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Icon, { type IconName } from "../ui/Icon"

interface NavTab {
  id: "home" | "experiences"
  label: string
  icon: IconName
  href: string
}

const TABS: NavTab[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  {
    id: "experiences",
    label: "Experiences",
    icon: "sparkles",
    href: "/experiences",
  },
]

const isActive = (tabId: NavTab["id"], pathname: string): boolean => {
  if (tabId === "home") return pathname === "/"
  if (tabId === "experiences") {
    return pathname.startsWith("/experiences") || pathname.startsWith("/guides")
  }
  return false
}

export default function TopNav() {
  const pathname = usePathname()
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo" aria-label="Handled — home">
          <Icon
            name="pin"
            size={28}
            fill="var(--rausch)"
            stroke="var(--rausch)"
            sw={0}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: -0.5,
              color: "var(--rausch)",
            }}
          >
            handled
          </span>
        </Link>

        <nav className="nav-tabs hide-mobile">
          {TABS.map((t) => {
            const active = isActive(t.id, pathname)
            return (
              <Link
                key={t.id}
                href={t.href}
                className={`nav-tab ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={t.icon} size={20} sw={1.6} />
                <span>{t.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="nav-actions">
          <a className="nav-host-link hide-mobile" href="#">
            Become a host
          </a>
          <button className="icon-btn hide-mobile" aria-label="Language">
            <Icon name="globe" size={16} />
          </button>
          <button className="nav-account">
            <Icon name="menu" size={14} />
            <div className="nav-avatar">
              <Icon name="user" size={16} stroke="white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
