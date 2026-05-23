"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { Link, usePathname } from "../../../i18n/navigation"
import Icon from "../ui/Icon"
import LocaleSwitcher from "./LocaleSwitcher"

interface NavTab {
  id: "planner" | "experiences" | "stories"
  labelKey: "planner" | "experiences" | "stories"
  href: string
  icon?: "sparkles"
}

const TABS: NavTab[] = [
  {
    id: "planner",
    labelKey: "planner",
    href: "/plan/new",
    icon: "sparkles",
  },
  {
    id: "experiences",
    labelKey: "experiences",
    href: "/experiences",
  },
  {
    id: "stories",
    labelKey: "stories",
    href: "/stories",
  },
]

const isActive = (tabId: NavTab["id"], pathname: string): boolean => {
  if (tabId === "planner") {
    return pathname.startsWith("/plan")
  }
  if (tabId === "experiences") {
    return pathname.startsWith("/experiences") || pathname.startsWith("/guides")
  }
  if (tabId === "stories") {
    return pathname.startsWith("/stories")
  }
  return false
}

export default function TopNav() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onEsc)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onEsc)
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo" aria-label={t("logoAria")}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: -0.5,
              color: "var(--rausch)",
            }}
          >
            Handled
          </span>
        </Link>

        <div className="nav-actions">
          <nav className="nav-tabs hide-mobile">
            {TABS.map((tab) => {
              const active = isActive(tab.id, pathname)
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`nav-tab ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {tab.icon === "sparkles" && (
                    <span className="nav-tab-icon" aria-hidden>
                      <Icon
                        name="sparkles"
                        size={16}
                        stroke="var(--rausch)"
                        fill="var(--rausch)"
                        sw={1.5}
                      />
                    </span>
                  )}
                  <span>{t(tab.labelKey)}</span>
                </Link>
              )
            })}
          </nav>
          <div className="hide-mobile">
            <LocaleSwitcher />
          </div>
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className="nav-account"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={t("accountMenuAria")}
            >
              <Icon name="menu" size={14} />
              <div className="nav-avatar">
                <Icon name="user" size={16} stroke="white" />
              </div>
            </button>
            {menuOpen && (
              <div className="account-dropdown" role="menu">
                <Link
                  href="/my-plans"
                  className="account-dropdown-item"
                  role="menuitem"
                >
                  <Icon name="bookmark" size={16} />
                  {t("myPlans")}
                </Link>
                <div className="account-dropdown-divider" />
                <a
                  href="#"
                  className="account-dropdown-item muted"
                  role="menuitem"
                >
                  <Icon name="message" size={16} />
                  {t("help")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
