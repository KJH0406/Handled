import { photo } from "../photo"
import type { Experience, Guide } from "../types/domain"

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-soyeon-1",
    guideId: "soyeon",
    title: "Real Seoul Food Crawl",
    photo: photo("photo-1624176193860-dd7866e5a8aa"),
    duration: 4,
    price: 65,
    maxGuests: 6,
    category: "Food",
    summary:
      "Skip the tourist spots — visit only places locals queue for. A 4-hour crawl across 4–5 hidden eateries.",
    includes: [
      "4–5 curated stops",
      "Local-only menu picks",
      "Food photos",
      "1 drink included",
    ],
  },
  {
    id: "exp-soyeon-2",
    guideId: "soyeon",
    title: "K-Beauty Shopping & Makeover",
    photo: photo("photo-1741896136113-c33a4fded0b5"),
    duration: 4,
    price: 75,
    maxGuests: 4,
    category: "Shopping",
    summary:
      "A curated tour of K-beauty shops in Myeongdong and Hongdae — paired with a free makeover for your skin tone.",
    includes: ["8–10 curated stores", "Skin analysis", "Makeover session"],
  },
  {
    id: "exp-soyeon-3",
    guideId: "soyeon",
    title: "Hongdae Hanbok & Café Hopping",
    photo: photo("photo-1517256064527-09c73fc73e38"),
    duration: 5,
    price: 85,
    maxGuests: 6,
    category: "Culture",
    summary:
      "Hanbok rental + 5 Insta-worthy cafés — a guaranteed-photogenic day with 100+ shots.",
    includes: ["4-hour hanbok rental", "5 café visits", "Pro-style photos"],
  },
  {
    id: "exp-minjun-1",
    guideId: "minjun",
    title: "Seoul Architecture Walk — DDP to Hanok",
    photo: photo("photo-1597259309583-aaa2584e2085"),
    duration: 5,
    price: 95,
    maxGuests: 6,
    category: "Architecture",
    summary:
      "From Zaha Hadid's DDP to 600-year-old hanok villages — a time-travel walk led by an architect.",
    includes: ["DDP · Bukchon · Jongmyo", "Architecture handouts", "Coffee break"],
  },
  {
    id: "exp-minjun-2",
    guideId: "minjun",
    title: "Gallery Tour & Contemporary Art",
    photo: photo("photo-1545987796-200677ee1011"),
    duration: 4,
    price: 85,
    maxGuests: 4,
    category: "Art",
    summary:
      "Curated tour of major galleries (Arario, Kukje, Leeum). A must for design lovers.",
    includes: ["4 galleries", "Curator chat", "Leeum Museum priority pass"],
  },
  {
    id: "exp-minjun-3",
    guideId: "minjun",
    title: "Hannam · Itaewon Rooftop Bar Crawl",
    photo: photo("photo-1493246318656-5bfd4cfb29b8"),
    duration: 4,
    price: 115,
    maxGuests: 4,
    category: "Nightlife",
    summary:
      "Top-3 Seoul rooftops + 1 hidden whisky bar. Includes one signature cocktail at each.",
    includes: ["4 bars", "4 signature cocktails", "Skyline photo spots"],
  },
  {
    id: "exp-soojin-1",
    guideId: "soojin",
    title: "Jagalchi Dawn Market Tour",
    photo: photo("photo-1558160074-4d7d8bdf4256"),
    duration: 3,
    price: 55,
    maxGuests: 5,
    category: "Food",
    summary:
      "5 a.m. at Jagalchi — live auctions and fresh seafood, straight off the boat.",
    includes: ["Live fish auction", "Fresh seafood buy", "Seaside breakfast"],
  },
  {
    id: "exp-soojin-2",
    guideId: "soojin",
    title: "Gamcheon Village Photo Walk",
    photo: photo("photo-1672671187899-a10f547341f1"),
    duration: 4,
    price: 69,
    maxGuests: 6,
    category: "Photo",
    summary:
      "Golden-hour walk through Gamcheon's alleys plus 7 signature Busan photo spots.",
    includes: ["7 photo spots", "Edit-tone guide", "40+ retouched photos"],
  },
  {
    id: "exp-soojin-3",
    guideId: "soojin",
    title: "Gwangalli Sunset Sailing",
    photo: photo("photo-1622219969983-45589eae5637"),
    duration: 3,
    price: 145,
    maxGuests: 4,
    category: "Beach",
    summary:
      "Sunset sail under Gwangan Bridge with onboard wine and finger food. Drone photos included.",
    includes: ["3-hour yacht", "Wine & finger food", "Drone shots"],
  },
  {
    id: "exp-dohyun-1",
    guideId: "dohyun",
    title: "Mt. Hallasan Sunrise Hike",
    photo: photo("photo-1558883493-8b86ff880fec"),
    duration: 8,
    price: 185,
    maxGuests: 4,
    category: "Nature",
    summary:
      "Depart at 4 a.m. → summit at sunrise → Baengnokdam crater. The most unforgettable 8 hours in Jeju.",
    includes: ["Pickup & drop-off", "Hiking gear", "Breakfast box", "Photos"],
  },
  {
    id: "exp-dohyun-2",
    guideId: "dohyun",
    title: "Haenyeo Village & Sea Experience",
    photo: photo("photo-1584345110951-7c0e3ca09b82"),
    duration: 4,
    price: 95,
    maxGuests: 6,
    category: "Culture",
    summary:
      "Meet real haenyeo (women divers), try harvesting seaweed, and sample fresh abalone sashimi.",
    includes: ["Haenyeo meeting", "Sea harvest experience", "Abalone tasting"],
  },
  {
    id: "exp-dohyun-3",
    guideId: "dohyun",
    title: "Jeju Black-Pork BBQ Night",
    photo: photo("photo-1672671247929-e35a095fbab7"),
    duration: 3,
    price: 69,
    maxGuests: 8,
    category: "Food",
    summary:
      "Direct from a Jeju butcher → BBQ at sunset. Unlimited makgeolli (Jeju rice wine).",
    includes: ["Unlimited black pork", "Jeju makgeolli", "BBQ setup"],
  },
  {
    id: "exp-hyerim-1",
    guideId: "hyerim",
    title: "Hanbok Stroll at Gyeongbokgung",
    photo: photo("photo-1711887540798-9d7d720e5319"),
    duration: 4,
    price: 79,
    maxGuests: 6,
    category: "Traditional",
    summary:
      "Hanbok rental + Gyeongbokgung guided tour. Watch the Royal Guard ceremony and capture lifetime photos.",
    includes: [
      "Hanbok rental",
      "Free entry",
      "Guard ceremony",
      "Photo session",
    ],
  },
  {
    id: "exp-hyerim-2",
    guideId: "hyerim",
    title: "Bukchon · Insadong Tea Ceremony",
    photo: photo("photo-1531969179221-3946e6b5a5e7"),
    duration: 4,
    price: 79,
    maxGuests: 6,
    category: "Culture",
    summary:
      "A traditional tea ceremony in a 600-year-old hanok plus a stroll through Bukchon's eight viewpoints.",
    includes: [
      "Traditional tea ceremony",
      "Bukchon walk",
      "Calligraphy class",
    ],
  },
  {
    id: "exp-hyerim-3",
    guideId: "hyerim",
    title: "Gwangjang Market & Rice Cake Class",
    photo: photo("photo-1744870132190-5c02d3f8d9f9"),
    duration: 4,
    price: 65,
    maxGuests: 5,
    category: "Food",
    summary:
      "A 120-year-old market food tour plus a hands-on injeolmi rice-cake making class.",
    includes: ["Market tour", "5 tastings", "Rice-cake kit"],
  },
  {
    id: "exp-sungwoo-1",
    guideId: "sungwoo",
    title: "Incheon Chinatown Food Walk",
    photo: photo("photo-1626803774007-f92c2c32cbe7"),
    duration: 4,
    price: 55,
    maxGuests: 8,
    category: "Food",
    summary:
      "Life-changing jajangmyeon to wood-fired dumplings — 30+ year-old institutions only.",
    includes: ["5 institutions", "Signature jajangmyeon", "1 dessert stop"],
  },
  {
    id: "exp-sungwoo-2",
    guideId: "sungwoo",
    title: "Songdo Central Park & Incheon Bridge",
    photo: photo("photo-1671959670540-d56f2849a375"),
    duration: 4,
    price: 55,
    maxGuests: 6,
    category: "Urban",
    summary:
      "A perfect day trip from Seoul — Songdo canal water-taxi ride plus the Incheon Bridge night view.",
    includes: ["Water taxi", "Bridge viewpoint", "1 Songdo café"],
  },
]

export const EXP_CATEGORIES: readonly string[] = [
  "All",
  ...Array.from(new Set(EXPERIENCES.map((e) => e.category))),
]

export const expGallery = (
  exp: Experience,
  guide: Guide | null | undefined,
): string[] => {
  const photos = [exp.photo, ...(guide?.gallery ?? [])]
  return [...new Set(photos)].slice(0, 5)
}

export const meetingPlace = (exp: Experience, guide: Guide): string =>
  `${guide.district} area · The exact meeting point is shared after booking.`
