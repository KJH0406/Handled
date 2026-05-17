export const usd = (n: number, locale: string = "en-US"): string =>
  "$" + new Intl.NumberFormat(locale).format(Math.round(n))

export const formatDate = (
  d: Date | null | undefined,
  locale: string = "en-US",
): string => {
  if (!d) return ""
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export const shortDate = (
  d: Date | null | undefined,
  locale: string = "en-US",
): string => {
  if (!d) return ""
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(d)
}
