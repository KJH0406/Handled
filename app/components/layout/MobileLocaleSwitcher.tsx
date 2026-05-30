"use client"

import { useLocale, useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { routing } from "../../../i18n/routing"
import { usePathname, useRouter } from "../../../i18n/navigation"
import Icon from "../ui/Icon"

const LABELS: Record<string, string> = {
  en: "English",
  ko: "한국어",
}

export default function MobileLocaleSwitcher() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onEsc)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onEsc)
    }
  }, [open])

  const select = (next: string) => {
    setOpen(false)
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div
      ref={wrapRef}
      className="mobile-locale show-mobile"
      style={{ position: "relative" }}
    >
      <button
        type="button"
        className="mobile-locale-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("languageAria")}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="globe" size={18} />
      </button>
      {open && (
        <div className="mobile-locale-menu" role="menu">
          {routing.locales.map((l) => {
            const active = l === locale
            return (
              <button
                key={l}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                className={`mobile-locale-item ${active ? "active" : ""}`}
                onClick={() => select(l)}
              >
                <span className="mobile-locale-check" aria-hidden>
                  {active ? "✓" : ""}
                </span>
                {LABELS[l] ?? l.toUpperCase()}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
