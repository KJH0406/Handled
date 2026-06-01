import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "ko"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // [PROTOTYPE] Always start in the default locale (English) regardless of the
  // visitor's browser language. The manual locale switcher still works because
  // it navigates to an explicitly prefixed path (e.g. /ko/...).
  //
  // TODO(production): remove this line (or set `localeDetection: true`) so the
  // first-visit locale is negotiated from the browser's Accept-Language header.
  localeDetection: false,
})

export type AppLocale = (typeof routing.locales)[number]
