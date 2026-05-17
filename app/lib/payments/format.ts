export const fmtCard = (v: string): string =>
  v
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19)

export const fmtExp = (v: string): string =>
  v
    .replace(/\D/g, "")
    .replace(/^(.{2})(.+)/, "$1/$2")
    .slice(0, 5)
