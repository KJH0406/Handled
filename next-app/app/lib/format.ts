const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

const DOWS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

export const usd = (n: number): string =>
  "$" + new Intl.NumberFormat("en-US").format(Math.round(n))

export const formatDate = (d: Date | null | undefined): string => {
  if (!d) return ""
  return `${DOWS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export const shortDate = (d: Date | null | undefined): string => {
  if (!d) return ""
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}
