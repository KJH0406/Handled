"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { Link, usePathname } from "../../../i18n/navigation"
import { useAuth } from "../auth/AuthProvider"
import Icon from "../ui/Icon"
import LocaleSwitcher from "./LocaleSwitcher"
import MobileLocaleSwitcher from "./MobileLocaleSwitcher"

interface NavTab {
  id: "planner" | "experiences" | "stories"
  labelKey: "planner" | "experiences" | "stories"
  href: string
  icon?: "sparkles"
  menuIcon: "sparkles" | "map" | "home"
}

const TABS: NavTab[] = [
  {
    id: "planner",
    labelKey: "planner",
    href: "/plan/new",
    icon: "sparkles",
    menuIcon: "sparkles",
  },
  {
    id: "experiences",
    labelKey: "experiences",
    href: "/experiences",
    menuIcon: "map",
  },
  {
    id: "stories",
    labelKey: "stories",
    href: "/stories",
    menuIcon: "home",
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
  const { user, signOut, hydrated } = useAuth()
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
              color: "var(--primary)",
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
                        stroke="var(--primary)"
                        fill="var(--primary)"
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
          <MobileLocaleSwitcher />
          {hydrated && !user && (
            <Link href="/sign-in" className="nav-signin hide-mobile">
              {t("signIn")}
            </Link>
          )}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className={`nav-account ${hydrated && !user ? "show-mobile" : ""}`}
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
                {user && (
                  <>
                    <div className="account-dropdown-user">
                      <div className="account-dropdown-user-name">
                        {user.name}
                      </div>
                      <div className="account-dropdown-user-email">
                        {user.email}
                      </div>
                    </div>
                    <div className="account-dropdown-divider" />
                  </>
                )}
                <div className="account-dropdown-mobile-only">
                  {TABS.map((tab) => {
                    const active = isActive(tab.id, pathname)
                    return (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        className={`account-dropdown-item ${active ? "active" : ""}`}
                        role="menuitem"
                        aria-current={active ? "page" : undefined}
                      >
                        {tab.menuIcon === "sparkles" ? (
                          <Icon
                            name="sparkles"
                            size={16}
                            stroke="var(--primary)"
                            fill="var(--primary)"
                            sw={1.5}
                          />
                        ) : (
                          <Icon name={tab.menuIcon} size={16} />
                        )}
                        {t(tab.labelKey)}
                      </Link>
                    )
                  })}
                  <div className="account-dropdown-divider" />
                </div>
                <Link
                  href="/my-plans"
                  className="account-dropdown-item"
                  role="menuitem"
                >
                  <Icon name="bookmark" size={16} />
                  {t("myPlans")}
                </Link>
                <a
                  href="#"
                  className="account-dropdown-item muted"
                  role="menuitem"
                >
                  <Icon name="message" size={16} />
                  {t("help")}
                </a>
                <div className="account-dropdown-divider" />
                {user ? (
                  <button
                    type="button"
                    className="account-dropdown-item"
                    role="menuitem"
                    onClick={() => {
                      signOut()
                      setMenuOpen(false)
                    }}
                  >
                    <Icon name="logOut" size={16} />
                    {t("signOut")}
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    className="account-dropdown-item"
                    role="menuitem"
                  >
                    <Icon name="user" size={16} />
                    {t("signIn")}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
