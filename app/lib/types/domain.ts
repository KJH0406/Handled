export type City =
  | "Seoul"
  | "Busan"
  | "Jeju"
  | "Jeonju"
  | "Gangneung"
  | "Gyeongju"
  | "Incheon"
  | "Sokcho"
  | "Daegu"
  | "Yeosu"

export type Language = "Korean" | "English" | "Japanese" | "Mandarin" | "French"

export interface Guide {
  id: string
  name: string
  photo: string
  gallery: string[]
  city: City
  district: string
  rating: number
  reviews: number
  hourlyRate: number
  yearsHosting: number
  superhost: boolean
  languages: Language[]
  styles: string[]
  oneLiner: string
  bio: string
  intro: string
  highlights: string[]
  cities: City[]
}

export type ExperienceCategory =
  | "Food"
  | "Shopping"
  | "Culture"
  | "Architecture"
  | "Art"
  | "Nightlife"
  | "Photo"
  | "Beach"
  | "Nature"
  | "Traditional"
  | "Urban"
  | "KPop"
  | "Beauty"

export interface Experience {
  id: string
  guideId: Guide["id"]
  title: string
  photo: string
  duration: number
  price: number
  maxGuests: number
  category: ExperienceCategory
  summary: string
  includes: string[]
}

export interface Review {
  name: string
  country: string
  date: string
  rating: number
  text: string
}

export interface HomeReview extends Review {
  guide: string
}

export type BookingMode = "custom" | "experience"

export interface Booking {
  mode: BookingMode
  experience: Experience | null
  guide: Guide
  hours: number
  date: Date
  time: string
  guests: number
  interests: string[]
  requests: string
  subtotal: number
  fee: number
  total: number
  payerName?: string
  cardLast4?: string
  bookingId?: string
}

export interface CategoryFallback {
  emoji: string
  bg: string
}

export interface ScheduleItem {
  title: string
  desc: string
}

export type StoryCategory =
  | "Culture"
  | "Food"
  | "Travel Tips"
  | "Neighborhoods"
  | "Nature"
  | "Destinations"

export interface Story {
  id: string
  title: string
  category: StoryCategory
  date: string
  readMinutes: number
  summary: string
  bg: string
  body: string[]
  featured?: boolean
}
