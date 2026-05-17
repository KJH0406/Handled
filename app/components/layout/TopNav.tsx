"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "../../../i18n/navigation"
import Icon, { type IconName } from "../ui/Icon"
import LocaleSwitcher from "./LocaleSwitcher"

interface NavTab {
  id: "home" | "experiences"
  labelKey: "home" | "experiences"
  icon: IconName
  href: string
}

const TABS: NavTab[] = [
  { id: "home", labelKey: "home", icon: "home", href: "/" },
  {
    id: "experiences",
    labelKey: "experiences",
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
  const t = useTranslations("nav")
  const pathname = usePathname()
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo" aria-label={t("logoAria")}>
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
          {TABS.map((tab) => {
            const active = isActive(tab.id, pathname)
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`nav-tab ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={tab.icon} size={20} sw={1.6} />
                <span>{t(tab.labelKey)}</span>
              </Link>
            )
          })}
        </nav>

        <div className="nav-actions">
          <a className="nav-host-link hide-mobile" href="#">
            {t("becomeHost")}
          </a>
          <div className="hide-mobile">
            <LocaleSwitcher />
          </div>
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
