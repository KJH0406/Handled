import type { City, ExperienceCategory } from "../types/domain"

/**
 * Real, city-specific venue pools that feed the dynamic planner.
 *
 * Seeded from the v7 mockup itinerary (Seoul-only). The generator picks a
 * venue per slot by category; each carries a locality (`area`), nearest
 * `station` (with exit) and a representative subway `line` so the result
 * screen can render real names and station-to-station transit
 * (see lib/planner/costing buildTransit).
 *
 * Cities without a pool fall back to the generic SCHEDULE_BY_CATEGORY steps,
 * and old saved plans (no venue fields) keep rendering generically.
 *
 * Note: exact street-level walk prose ("8 min walk uphill") is pair-specific
 * and only authorable for a fixed itinerary — the dynamic equivalent here is
 * station→station + line badge + a walk leg for same-area hops.
 */
export interface Venue {
  /** Real venue name → slot.title */
  name: string
  /** Locality, e.g. "Jongno" → slot.area, used to build transit routes */
  area: string
  /** Nearest subway station with exit, e.g. "Anguk Stn (Exit 1)" → slot.station */
  station?: string
  /** Representative subway line serving the venue → slot.line, transit badge */
  line?: string
  /** Short description → slot.note */
  desc: string
  /** Local tip → slot.tip */
  tip?: string
}

const SEOUL: Partial<Record<ExperienceCategory, Venue[]>> = {
  Culture: [
    {
      name: "Gyeongbokgung Palace",
      area: "Jongno",
      station: "Gyeongbokgung Stn (Exit 5)",
      line: "Line 3",
      desc: "Joseon's grand main palace - catch the Royal Guard changing ceremony.",
      tip: "Arrive at opening for the 10 AM guard ceremony before the crowds.",
    },
    {
      name: "Changdeokgung & Secret Garden",
      area: "Jongno",
      station: "Anguk Stn (Exit 3)",
      line: "Line 3",
      desc: "UNESCO palace with a hidden rear garden tour.",
      tip: "Reserve the Secret Garden tour online - daily slots sell out.",
    },
    {
      name: "National Museum of Korea",
      area: "Yongsan",
      station: "Ichon Stn (Exit 2)",
      line: "Line 4",
      desc: "Korea's flagship museum, from prehistory to the Joseon court.",
      tip: "The Pensive Bodhisattva room alone is worth the trip.",
    },
  ],
  Architecture: [
    {
      name: "Dongdaemun Design Plaza",
      area: "Dongdaemun",
      station: "Dongdaemun History & Culture Park Stn (Exit 1)",
      line: "Line 2",
      desc: "Zaha Hadid's flowing neofuturist landmark (DDP).",
      tip: "Come after dark - the LED rose garden and curves light up.",
    },
    {
      name: "Bukchon Hanok Village",
      area: "Jongno",
      station: "Anguk Stn (Exit 2)",
      line: "Line 3",
      desc: "Lanes of preserved hanok between two palaces.",
      tip: "Gahoe-dong 31 is the best view - keep quiet, people live here.",
    },
    {
      name: "Lotte World Tower Seoul Sky",
      area: "Jamsil",
      station: "Jamsil Stn (Exit 1)",
      line: "Line 2",
      desc: "Korea's tallest tower with a glass-floor observatory.",
      tip: "Sunset slots give you day and night views in one visit.",
    },
  ],
  Traditional: [
    {
      name: "Insadong & Ssamzigil",
      area: "Jongno",
      station: "Anguk Stn (Exit 6)",
      line: "Line 3",
      desc: "Traditional crafts, tea houses, and the spiral Ssamzigil court.",
      tip: "Ssamzigil's top floor has the best handcrafted ceramic gifts.",
    },
    {
      name: "Namsangol Hanok Village",
      area: "Jung-gu",
      station: "Chungmuro Stn (Exit 3)",
      line: "Line 3",
      desc: "Restored noble houses with hanbok and craft experiences.",
      tip: "Free hanbok photo spots - weekday mornings are quietest.",
    },
    {
      name: "Tongin Market",
      area: "Jongno",
      station: "Gyeongbokgung Stn (Exit 2)",
      line: "Line 3",
      desc: "Old-town market famous for its brass-coin lunchbox.",
      tip: "Buy tokens at the entrance and fill your tray stall by stall.",
    },
  ],
  Nature: [
    {
      name: "Ichon Hangang Park",
      area: "Yongsan",
      station: "Ichon Stn (Exit 4)",
      line: "Line 4",
      desc: "Riverside lawns with a golden-hour view of Wonhyo Bridge.",
      tip: "Face west from the main lawn for Seoul's best sunset.",
    },
    {
      name: "Namsan Park",
      area: "Jung-gu",
      station: "Myeongdong Stn (Exit 3)",
      line: "Line 4",
      desc: "Forested city peak crowned by N Seoul Tower.",
      tip: "Take the gentle Bukchon-side trail up instead of the cable car.",
    },
    {
      name: "Seoul Forest",
      area: "Seongdong",
      station: "Seoul Forest Stn (Exit 3)",
      line: "Bundang Line",
      desc: "Wetland and deer park beside the Han River.",
      tip: "The deer enclosure and tram path are loveliest mid-morning.",
    },
  ],
  Photo: [
    {
      name: "N Seoul Tower",
      area: "Namsan",
      station: "Myeongdong Stn (Exit 3)",
      line: "Line 4",
      desc: "Panoramic deck over the whole city skyline.",
      tip: "Bus 02 from Chungmuro beats the cable-car queue.",
    },
    {
      name: "Ihwa Mural Village",
      area: "Jongno",
      station: "Hyehwa Stn (Exit 2)",
      line: "Line 4",
      desc: "Hillside lanes covered in murals and art installations.",
      tip: "Wear comfy shoes - it's all stairs, but the rooftop views pay off.",
    },
    {
      name: "Seoullo 7017 Skygarden",
      area: "Jung-gu",
      station: "Seoul Stn (Exit 2)",
      line: "Line 1",
      desc: "Elevated garden walkway above Seoul Station.",
      tip: "Best light is just before sunset, looking toward Namsan.",
    },
  ],
  Food: [
    {
      name: "Gwangjang Market",
      area: "Jongno",
      station: "Jongno 5-ga Stn (Exit 8)",
      line: "Line 1",
      desc: "Seoul's oldest market - bindaetteok and mayak gimbap.",
      tip: "Go for the inner food alley; the mung-bean pancakes are unmissable.",
    },
    {
      name: "Mangwon Market",
      area: "Mapo",
      station: "Mangwon Stn (Exit 2)",
      line: "Line 6",
      desc: "Local neighborhood market loved for cheap street eats.",
      tip: "Grab fried chicken and tteokbokki to eat by the Han River nearby.",
    },
    {
      name: "Myeongdong Street Food",
      area: "Jung-gu",
      station: "Myeongdong Stn (Exit 6)",
      line: "Line 4",
      desc: "Sizzling stalls of tteokbokki, hotteok, and grilled cheese.",
      tip: "Stalls open from late afternoon - come hungry around 6 PM.",
    },
  ],
  Shopping: [
    {
      name: "Myeongdong Shopping Street",
      area: "Jung-gu",
      station: "Myeongdong Stn (Exit 6)",
      line: "Line 4",
      desc: "Flagship K-beauty and fashion stores, end to end.",
      tip: "Beauty brands stay open till 10 PM - shop after dinner.",
    },
    {
      name: "Apgujeong Rodeo Street",
      area: "Gangnam",
      station: "Apgujeong Rodeo Stn (Exit 5)",
      line: "Bundang Line",
      desc: "Designer boutiques and trend-setting select shops.",
      tip: "Gentle Monster and local designers cluster on the main strip.",
    },
    {
      name: "Hongdae Shopping Streets",
      area: "Mapo",
      station: "Hongik Univ. Stn (Exit 9)",
      line: "Line 2",
      desc: "Indie fashion, vinyl, and quirky concept stores.",
      tip: "The side alleys off the main drag hide the best independent shops.",
    },
  ],
  Art: [
    {
      name: "Leeum Museum of Art",
      area: "Yongsan",
      station: "Hangangjin Stn (Exit 1)",
      line: "Line 6",
      desc: "Samsung's landmark museum of old and contemporary art.",
      tip: "Free general admission - book a timed slot to skip the line.",
    },
    {
      name: "Seochon Galleries",
      area: "Jongno",
      station: "Gyeongbokgung Stn (Exit 2)",
      line: "Line 3",
      desc: "Artist studios and small galleries in old-town alleys.",
      tip: "Pair it with a coffee at one of Seochon's hanok cafes.",
    },
    {
      name: "Daelim Changgo Gallery",
      area: "Seongsu",
      station: "Seongsu Stn (Exit 1)",
      line: "Line 2",
      desc: "A converted warehouse gallery-cafe in hip Seongsu.",
      tip: "Equal parts exhibition and photo spot - go for both.",
    },
  ],
  Urban: [
    {
      name: "Seongsu-dong Cafe Street",
      area: "Seongsu",
      station: "Seongsu Stn (Exit 3)",
      line: "Line 2",
      desc: "Seoul's Brooklyn - converted factories and specialty coffee.",
      tip: "Start at Cafe Onion, then wander toward Daelim Warehouse.",
    },
    {
      name: "Yeouido Hangang Park",
      area: "Yeouido",
      station: "Yeouinaru Stn (Exit 2)",
      line: "Line 5",
      desc: "Wide riverfront promenade and skyline views.",
      tip: "Rent a bike along the river or grab a convenience-store ramyeon.",
    },
    {
      name: "COEX & Starfield Library",
      area: "Gangnam",
      station: "Samseong Stn (Exit 5)",
      line: "Line 2",
      desc: "Giant mall with the photogenic open Starfield Library.",
      tip: "The two-story bookshelves are the signature photo - go on arrival.",
    },
  ],
  Beach: [
    {
      name: "Banpo Hangang Park",
      area: "Seocho",
      station: "Express Bus Terminal Stn (Exit 8-1)",
      line: "Line 9",
      desc: "Riverside park with the Moonlight Rainbow Fountain.",
      tip: "Evening fountain shows run on the hour - check the schedule.",
    },
    {
      name: "Ttukseom Hangang Resort",
      area: "Gwangjin",
      station: "Ttukseom Resort Stn (Exit 2)",
      line: "Line 7",
      desc: "Riverside leisure zone with pools and rentals.",
      tip: "Sunset over the river here rivals any coastal view.",
    },
    {
      name: "Nanji Hangang Park",
      area: "Mapo",
      station: "World Cup Stadium Stn (Exit 1)",
      line: "Line 6",
      desc: "Breezy riverside fields popular for picnics and camping.",
      tip: "The pink muhly grass in autumn is the standout photo.",
    },
  ],
  Beauty: [
    {
      name: "Ryu Salon Cheongdam",
      area: "Gangnam",
      station: "Apgujeong Rodeo Stn (Exit 5)",
      line: "Bundang Line",
      desc: "Celebrity hair salon known for signature cuts and styling.",
      tip: "Book via Naver Reservation 2 weeks ahead and ask for the signature cut.",
    },
    {
      name: "Banobagi Clinic Apgujeong",
      area: "Gangnam",
      station: "Apgujeong Stn (Exit 5)",
      line: "Line 3",
      desc: "Skincare clinic loved by visitors for same-day glow treatments.",
      tip: "Pre-book the Aqua Peel + LED combo - results show the same day.",
    },
    {
      name: "Sulwhasoo Flagship Bukchon",
      area: "Jongno",
      station: "Anguk Stn (Exit 1)",
      line: "Line 3",
      desc: "Hanok-style flagship spa for premium K-beauty rituals.",
      tip: "Reserve a spa ritual upstairs, not just the ground-floor shop.",
    },
  ],
  KPop: [
    {
      name: "HYBE Insight & Flagship",
      area: "Yongsan",
      station: "Sinyongsan Stn (Exit 3)",
      line: "Line 4",
      desc: "Label HQ with artist merch and themed spaces (BTS and more).",
      tip: "Official merch sells out fast - go early for the popular drops.",
    },
    {
      name: "K-Star Road Apgujeong",
      area: "Gangnam",
      station: "Apgujeong Rodeo Stn (Exit 2)",
      line: "Bundang Line",
      desc: "Idol 'GangnamDol' bear statues lining a designer street.",
      tip: "Hunt down your bias's bear, then cafe-hop the side streets.",
    },
    {
      name: "Hongdae Busking Street",
      area: "Mapo",
      station: "Hongik Univ. Stn (Exit 9)",
      line: "Line 2",
      desc: "Live street performances and dance crews after dark.",
      tip: "Weekend nights have the best busking - stay till the crews come out.",
    },
  ],
  Nightlife: [
    {
      name: "Hongdae Night Scene",
      area: "Mapo",
      station: "Hongik Univ. Stn (Exit 9)",
      line: "Line 2",
      desc: "Bars, clubs, and live music in Seoul's youth district.",
      tip: "Start with dinner in Yeonnam-dong, then head to the main stage.",
    },
    {
      name: "Itaewon Bar Street",
      area: "Yongsan",
      station: "Itaewon Stn (Exit 1)",
      line: "Line 6",
      desc: "International bars and rooftops along The Hill.",
      tip: "Rooftop terraces here have the best skyline drinks.",
    },
    {
      name: "Euljiro Pojangmacha Alley",
      area: "Jung-gu",
      station: "Euljiro 3-ga Stn (Exit 4)",
      line: "Line 2",
      desc: "Retro 'Hipjiro' tents and hidden printing-district bars.",
      tip: "Look for unmarked doors and stairwells - the best bars hide upstairs.",
    },
  ],
}

export const VENUES_BY_CITY: Partial<
  Record<City, Partial<Record<ExperienceCategory, Venue[]>>>
> = {
  Seoul: SEOUL,
}

/** Deterministic venue pick for a city + category, or null to fall back. */
export const pickVenue = (
  city: City,
  category: ExperienceCategory,
  index: number,
): Venue | null => {
  const pool = VENUES_BY_CITY[city]?.[category]
  if (!pool || pool.length === 0) return null
  return pool[Math.abs(index) % pool.length]
}
