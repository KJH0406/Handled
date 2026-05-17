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
]

const DOWS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const usd = (n) =>
  "$" + new Intl.NumberFormat("en-US").format(Math.round(n))

export const formatDate = (d) => {
  if (!d) return ""
  return `${DOWS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export const shortDate = (d) => {
  if (!d) return ""
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}
