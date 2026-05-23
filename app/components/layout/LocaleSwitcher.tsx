"use client"

import { useLocale, useTranslations } from "next-intl"
import type { ChangeEvent } from "react"
import { routing } from "../../../i18n/routing"
import { usePathname, useRouter } from "../../../i18n/navigation"
import Icon from "../ui/Icon"

const LABELS: Record<string, string> = {
  en: "English",
  ko: "한국어",
}

export default function LocaleSwitcher() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value
    router.replace(pathname, { locale: next })
  }

  return (
    <label className="locale-switcher" aria-label={t("languageAria")}>
      <Icon name="globe" size={18} />
      <span className="locale-switcher__divider" aria-hidden />
      <span className="locale-switcher__code">{locale.toUpperCase()}</span>
      <select
        value={locale}
        onChange={onChange}
        className="locale-switcher__select"
        aria-label={t("languageAria")}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {LABELS[l] ?? l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  )
}
