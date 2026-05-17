export const PHOTO_BASE = "https://images.unsplash.com/"

export const photo = (id, w = 800) =>
  `${PHOTO_BASE}${id}?w=${w}&h=${w}&fit=crop&auto=format&q=80`
