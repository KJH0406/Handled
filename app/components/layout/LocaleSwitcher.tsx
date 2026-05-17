"use client"

import { useLocale, useTranslations } from "next-intl"
import type { ChangeEvent } from "react"
import { routing } from "../../../i18n/routing"
import { usePathname, useRouter } from "../../../i18n/navigation"
import Icon from "../ui/Icon"

const LABELS: Record<string, string> = {
  en: "English",
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
      <Icon name="globe" size={16} />
      <select
        value={locale}
        onChange={onChange}
        className="locale-switcher__select"
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
