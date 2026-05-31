import { KRW_PER_USD } from "./planner/types"

export const usd = (n: number, locale: string = "en-US"): string =>
  "$" + new Intl.NumberFormat(locale).format(Math.round(n))

/**
 * Format a KRW-canonical amount for display.
 * - `ko` locale → exact won (₩18,000)
 * - otherwise   → USD converted at the fixed prototype rate, nearest dollar ($13)
 *
 * Unlike the wizard's coarse nearest-$10 budget label, this keeps single-dollar
 * precision so small per-activity costs read correctly.
 */
export const money = (krw: number, locale: string = "en-US"): string => {
  if (locale.startsWith("ko")) return `₩${krw.toLocaleString("ko-KR")}`
  const dollars = Math.round(krw / KRW_PER_USD)
  return `$${dollars.toLocaleString("en-US")}`
}

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
