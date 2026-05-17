"use client"

import { usePathname } from "next/navigation"
import Icon from "../ui/Icon"
import { useAppNavigate } from "../../lib/navigation"

const TABS = [
  { id: "home", label: "Home", icon: "home", target: "home" },
  {
    id: "experiences",
    label: "Experiences",
    icon: "sparkles",
    target: "experiences",
  },
]

// Guide list / profile screens are still reachable (e.g. tapping a host
// avatar from an experience), so we keep the Experiences tab highlighted
// while the user is anywhere inside that exploration flow.
const isActive = (tabId, pathname) => {
  if (tabId === "home") return pathname === "/"
  if (tabId === "experiences") {
    return (
      pathname.startsWith("/experiences") || pathname.startsWith("/guides")
    )
  }
  return false
}

export default function TopNav() {
  const navigate = useAppNavigate()
  const pathname = usePathname()
  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="nav-logo" onClick={() => navigate("home")}>
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
        </div>

        <nav className="nav-tabs hide-mobile">
          {TABS.map((t) => (
            <div
              key={t.id}
              className={`nav-tab ${isActive(t.id, pathname) ? "active" : ""}`}
              onClick={() => navigate(t.target)}
            >
              <Icon name={t.icon} size={20} sw={1.6} />
              <span>{t.label}</span>
            </div>
          ))}
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
