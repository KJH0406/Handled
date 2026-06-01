import type { Story, StoryCategory } from "../types/domain"

export const STORY_CATEGORIES: ("All" | StoryCategory)[] = [
  "All",
  "Culture",
  "Food",
  "Travel Tips",
  "Neighborhoods",
  "Nature",
  "Destinations",
]

export const STORIES: Story[] = [
  {
    id: "hidden-alleys-bukchon",
    title: "The Hidden Alleys of Bukchon",
    category: "Culture",
    date: "May 18, 2026",
    readMinutes: 5,
    summary:
      "Beyond the famous rooftop views lies a labyrinth of quiet lanes where Seoul's past breathes quietly.",
    bg: "linear-gradient(155deg,#14213d,#2a4580)",
    tags: ["Seoul", "Bukchon", "Hanok", "Walking", "Hidden Gems"],
    featured: true,
    body: [
      "Most travelers pour into Bukchon Hanok Village for the rooftop shot - the cascade of grey-tiled roofs falling away toward the city. But the moment you step three lanes off the main route, the crowds vanish and Bukchon's real character takes over.",
      "Start at Gahoe-dong 31 in the early morning, before the tour buses arrive. The slope is steep enough that most visitors stop halfway, which means you get the upper alleys almost to yourself. Pay attention to the doorways: each hanok has a different carved transom, and several of the older homes are still single-family residences - the kind of detail that makes Bukchon a living neighborhood rather than a museum.",
      "Drop down toward Samcheong-dong via the narrow stairway behind Bukchon Cultural Center. The descent passes a series of converted hanoks now housing tiny galleries, a hand-bound notebook studio, and one of the best matcha bars in the city. None of them have signage in English - which is exactly the point.",
      "End at the old wall of Gyeongbokgung. From here you can see the rhythm Bukchon was always meant to have: the palace below, the mountain above, and the quiet wooden homes holding the line in between.",
    ],
  },
  {
    id: "late-night-pojangmacha",
    title: "Seoul's Best Kept Food Secret: Late-Night Pojangmacha",
    category: "Food",
    date: "May 12, 2026",
    readMinutes: 4,
    summary:
      "When the city never sleeps, its street food scene comes alive. Here is where locals actually eat after midnight.",
    bg: "linear-gradient(155deg,#2a1200,#6b3510)",
    tags: ["Seoul", "Street Food", "Local Food", "Nightlife", "Hidden Gems"],
    body: [
      "Pojangmacha - the orange-tarp street tents that bloom outside Seoul's subway exits after dark - are not the tourist version you see on travel shows. The good ones are in unexpected places: behind office towers in Yeoksam, along the Han River cycle paths, tucked into alleys in Jongno.",
      "What to order: a small bottle of soju, a plate of nakji bokkeum (spicy octopus), and whatever the ajumma running the cart recommends from the day's stew pot. Most carts also do gyeran-mari, the rolled egg omelet, which arrives within minutes of being ordered.",
      "The unwritten rule is that pojangmacha are for lingering. You sit on a plastic stool, you talk, you eat slowly. Trying to rush a pojangmacha visit is missing the point entirely - the whole point is that the world feels smaller and warmer for an hour.",
      "Cash only, in most cases. And bring a Korean speaker if you want the full experience: the best stalls reward conversation.",
    ],
  },
  {
    id: "gyeongbokgung-first-timers",
    title: "A First-Timer's Guide to Gyeongbokgung Palace",
    category: "Travel Tips",
    date: "May 8, 2026",
    readMinutes: 7,
    summary:
      "Everything you need to know before visiting Seoul's most iconic landmark - including what most tour guides skip.",
    bg: "linear-gradient(155deg,#03462E,#0A6B47)",
    tags: ["Seoul", "Palaces", "First Timer", "Walking", "Photo Spots"],
    body: [
      "Gyeongbokgung is enormous - far larger than first-time visitors expect. Plan on at least two hours, and arrive at opening (9:00 AM) to catch the Royal Guard Changing Ceremony at 10:00 AM before the tour groups roll in.",
      "Buy your ticket at the main gate but skip the rented hanbok unless you actually want one - wearing a hanbok grants free admission, but the rental shops near the palace charge nearly the same as admission anyway.",
      "Three spots most visitors miss: the Eastern Palace gardens behind the main throne hall (almost always empty), the small pond beside Gyeonghoeru Pavilion in late afternoon, and the National Folk Museum on the eastern edge of the grounds, which is free with admission and far better than its name suggests.",
      "Best exit is the northern gate, which puts you right at Cheong Wa Dae (the old Blue House) and the start of the Bukchon walk - turning a single visit into a half-day route through Seoul's historic heart.",
    ],
  },
  {
    id: "seongsu-dong-love",
    title: "Why Every Traveler Falls in Love with Seongsu-dong",
    category: "Neighborhoods",
    date: "May 2, 2026",
    readMinutes: 6,
    summary:
      "Seoul's answer to Brooklyn: artisan coffee, converted factories, and creative energy that's impossible to bottle.",
    bg: "linear-gradient(155deg,#132e13,#1f5c1f)",
    tags: ["Seoul", "Cafes", "Photo Spots", "Hidden Gems", "Local Food"],
    body: [
      "Twenty years ago, Seongsu-dong was a printing and shoe-manufacturing district. Today it is the gravitational center of Seoul's design scene - and the conversion happened so recently that the old factories are still visible inside the new cafes.",
      "Start at Cafe Onion, the original branch built inside an industrial warehouse. The pastry case is a destination on its own, and the bare-concrete interior is what every Pinterest-Seoul photo is trying to imitate.",
      "Walk south to Daerim Warehouse and Center Coffee, both of which take the converted-industrial aesthetic in different directions - one bigger and more sculptural, one quieter and more focused on the coffee itself.",
      "End the day at Seongsu Federation, a multi-building complex that hosts pop-up exhibitions, indie boutiques, and one of the best secondhand bookshops in the city. If you only have one neighborhood for a creative-Seoul day, this is it.",
    ],
  },
  {
    id: "hangang-locals-guide",
    title: "Hangang River: Where Seoul Comes to Breathe",
    category: "Nature",
    date: "Apr 28, 2026",
    readMinutes: 4,
    summary:
      "A local's guide to the riverside parks, picnic culture, and the sunset spots that make you stay another week.",
    bg: "linear-gradient(155deg,#091520,#0f3d66)",
    tags: ["Seoul", "Hangang", "Sunset", "Photo Spots", "Picnic"],
    body: [
      "Seoul has eleven Hangang Riverside Parks strung along both banks of the river. They are not equivalent - each has a different personality, and which one you visit shapes the day.",
      "Yeouido is the famous one: cherry blossoms in spring, fireworks in fall, and the most crowds year-round. Banpo is the one with the Rainbow Bridge fountain show (best at 8 PM in summer). Ttukseom is where the surfers and paddleboarders go.",
      "But the locals' pick is Ichon: a long stretch on the north bank with grass instead of pavement, a clear west view, and far fewer crowds. Bring a cheap mat, order chicken via the Bandi app (delivery drones literally land on the lawn), and watch the sun set behind Wonhyo Bridge.",
      "Stay until the city lights come up. The Hangang at night is a different river - and it's the moment travelers usually decide to stay an extra week.",
    ],
  },
  {
    id: "jeju-beyond-tourist-trail",
    title: "Jeju Island: Beyond the Tourist Trail",
    category: "Destinations",
    date: "Apr 22, 2026",
    readMinutes: 8,
    summary:
      "The volcanic island has far more to offer than lava tubes and haenyeo divers - if you know where to look.",
    bg: "linear-gradient(155deg,#251535,#4a1f6e)",
    tags: ["Jeju", "Walking", "Hiking", "Sunset", "Hidden Gems"],
    body: [
      "Jeju's tourist map is dominated by three things: Hallasan, the lava tubes, and the haenyeo (women free divers) of Seongsan. All are worth seeing once. But the island that travelers fall for is the one between those landmarks.",
      "The Olle Trail is the secret. A 437-kilometer network of 27 walking routes loops the entire coast, threading through fishing villages, tangerine farms, basalt cliffs, and forests of black bamboo. You can walk a single route as a day hike or chain three or four together over a week.",
      "Route 7 (Oedolgae to Wolpyeong) is the photographer's favorite - dramatic sea cliffs and tide pools. Route 10 (Hwasun to Moseulpo) ends at the otherworldly Sanbangsan rock formation. Route 14-1 takes you inland through black-pine forest to the rim of Mt. Geumoreum - one of the best sunsets in Korea.",
      "Stay in a guesthouse run by a local resident - not a chain hotel. The conversations you'll have over breakfast are the real reason to visit Jeju.",
    ],
  },
]
