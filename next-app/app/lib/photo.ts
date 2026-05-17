export const PHOTO_BASE = "https://images.unsplash.com/"

export const photo = (id: string, w: number = 800): string =>
  `${PHOTO_BASE}${id}?w=${w}&h=${w}&fit=crop&auto=format&q=80`
