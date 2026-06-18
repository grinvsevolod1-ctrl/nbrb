// Demo dataset for the Dissidentby news feed.
// All names are first-name + encrypted surname initial only. No real personal data is published.

export type NewsCategory =
  | "humanitarian"
  | "asylum"
  | "greencard"
  | "reunification"
  | "work"

export type NewsItem = {
  id: number
  date: string // ISO date
  name: string
  countryCode: string
  country: string
  city: string
  category: NewsCategory
  categoryLabel: string
  image: string
  title: string
  excerpt: string
}

export type OriginCountry = {
  code: string
  name: string
  coordinates: [number, number] // [lng, lat]
  helped: number
}

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  humanitarian: "Гуманитарная виза",
  asylum: "Политическое убежище",
  greencard: "Грин-карта",
  reunification: "Воссоединение семьи",
  work: "Рабочая виза",
}

export const CATEGORY_FILTERS: { value: NewsCategory | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "humanitarian", label: "Гуманитарная виза" },
  { value: "asylum", label: "Убежище" },
  { value: "greencard", label: "Грин-карта" },
  { value: "reunification", label: "Воссоединение семьи" },
  { value: "work", label: "Рабочая виза" },
]

// Origin countries with approximate capital coordinates and number of people helped.
export const ORIGIN_COUNTRIES: OriginCountry[] = [
  { code: "BY", name: "Беларусь", coordinates: [27.57, 53.9], helped: 1240 },
  { code: "RU", name: "Россия", coordinates: [37.62, 55.75], helped: 980 },
  { code: "UA", name: "Украина", coordinates: [30.52, 50.45], helped: 410 },
  { code: "KZ", name: "Казахстан", coordinates: [71.45, 51.18], helped: 187 },
  { code: "GE", name: "Грузия", coordinates: [44.79, 41.71], helped: 156 },
  { code: "AZ", name: "Азербайджан", coordinates: [49.87, 40.41], helped: 98 },
  { code: "UZ", name: "Узбекистан", coordinates: [69.24, 41.31], helped: 76 },
  { code: "KG", name: "Кыргызстан", coordinates: [74.59, 42.87], helped: 54 },
  { code: "TJ", name: "Таджикистан", coordinates: [68.78, 38.56], helped: 47 },
  { code: "AM", name: "Армения", coordinates: [44.51, 40.18], helped: 63 },
  { code: "MD", name: "Молдова", coordinates: [28.86, 47.01], helped: 39 },
  { code: "TM", name: "Туркменистан", coordinates: [58.38, 37.96], helped: 21 },
]

const TOTAL_HELPED = ORIGIN_COUNTRIES.reduce((s, c) => s + c.helped, 0)

export const STATS = {
  totalHelped: TOTAL_HELPED,
  countries: ORIGIN_COUNTRIES.length,
  approvalRate: 94,
  sinceLabel: "10 января 2024",
}

const FIRST_NAMES = [
  "Андрей", "Сергей", "Дмитрий", "Алексей", "Иван", "Павел", "Максим",
  "Виктор", "Олег", "Николай", "Артём", "Кирилл", "Роман", "Егор",
  "Антон", "Владислав", "Глеб", "Тимур", "Денис", "Михаил",
  "Мария", "Анна", "Елена", "Ольга", "Наталья", "Татьяна", "Ирина",
  "Светлана", "Юлия", "Екатерина", "Дарья", "Виктория", "Анастасия",
  "Ксения", "Алина", "Полина", "Маргарита", "Вероника",
]

const SURNAME_INITIALS = [
  "К", "С", "М", "П", "Б", "Г", "Д", "Л", "Р", "Т",
  "Ф", "Х", "Ч", "Ш", "В", "Н", "З", "Я", "О", "Ж",
]

const US_CITIES = [
  "Нью-Йорк", "Чикаго", "Сиэтл", "Бостон", "Сан-Франциско", "Майами",
  "Остин", "Денвер", "Портленд", "Миннеаполис", "Атланта", "Вашингтон",
  "Лос-Анджелес", "Филадельфия", "Сан-Диего", "Хьюстон", "Феникс",
]

const IMAGES = [
  "/news/visa-document.png",
  "/news/statue-liberty.png",
  "/news/courthouse.png",
  "/news/immigration-office.png",
  "/news/passport-stamp.png",
  "/news/capitol.png",
  "/news/airport.png",
  "/news/flag.png",
  "/news/signing.png",
  "/news/cityscape.png",
  "/news/official-seal.png",
  "/news/greencard-closeup.png",
  "/news/embassy.png",
  "/news/welcome-sign.png",
  "/news/ceremony-flags.png",
  "/news/law-books.png",
  "/news/golden-gate.png",
  "/news/brooklyn-bridge.png",
  "/news/washington-monument.png",
  "/news/suburban-home.png",
  "/news/interview-booth.png",
  "/news/legal-folders.png",
  "/news/biometric.png",
  "/news/boarding-pass.png",
  "/news/open-road.png",
  "/news/lady-justice.png",
  "/news/government-facade.png",
  "/news/main-street.png",
  "/news/airplane-wing.png",
  "/news/desk-documents.png",
  "/news/welcome-packet.png",
  "/news/university-campus.png",
  "/news/handshake.png",
  "/news/skyline-dawn.png",
  "/news/new-keys.png",
]

const CATEGORIES: NewsCategory[] = [
  "humanitarian", "humanitarian", "asylum", "asylum", "greencard",
  "reunification", "work",
]

const TITLE_TEMPLATES: Record<NewsCategory, string[]> = {
  humanitarian: [
    "{name} получил(а) гуманитарную визу в США",
    "Гуманитарный пароль одобрен: {name} прибыл(а) в {city}",
    "{name} из страны {country} получил(а) защиту по гуманитарной программе",
  ],
  asylum: [
    "{name} предоставлено политическое убежище в США",
    "Суд в {city} удовлетворил прошение об убежище для {name}",
    "{name} признан(а) беженцем и получил(а) право остаться в США",
  ],
  greencard: [
    "{name} получил(а) грин-карту США",
    "{name} оформил(а) постоянный вид на жительство в США",
    "Грин-карта одобрена: новый этап для {name} в {city}",
  ],
  reunification: [
    "Семья {name} воссоединилась в {city}",
    "{name} перевёз(ла) близких в США по программе воссоединения",
    "{name} и семья получили разрешение на въезд в США",
  ],
  work: [
    "{name} получил(а) рабочую визу и приступил(а) к работе в {city}",
    "Рабочая виза одобрена: {name} начинает новую жизнь в США",
    "{name} трудоустроен(а) в {city} после получения визы",
  ],
}

const EXCERPT_TEMPLATES = [
  "При юридическом сопровождении Dissidentby подготовлен полный пакет документов. Дело рассматривалось {months} мес.",
  "Команда Dissidentby помогла собрать доказательную базу преследований и сопроводила заявителя на интервью.",
  "После обращения в Dissidentby заявление было подано в кратчайшие сроки, первый ответ пришёл за несколько дней.",
  "Случай сопровождался юристами организации от подачи до финального решения. Личные данные не разглашаются.",
  "Dissidentby обеспечил перевод и заверение документов, а также подготовку к собеседованию в консульстве.",
  "Заявитель находился под угрозой преследования. Организация добилась рассмотрения по приоритетной процедуре.",
]

// Simple deterministic PRNG so the feed is stable across renders (no hydration mismatch).
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T,>(rng: () => number, arr: T[]): T => arr[Math.floor(rng() * arr.length)]

const TOTAL_ITEMS = 168
const START = new Date("2024-01-10").getTime()
const END = new Date("2026-06-15").getTime()

function buildItems(): NewsItem[] {
  const items: NewsItem[] = []
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const rng = mulberry32(i * 2654435761 + 12345)
    const category = pick(rng, CATEGORIES)
    const firstName = pick(rng, FIRST_NAMES)
    const initial = pick(rng, SURNAME_INITIALS)
    const name = `${firstName} ${initial}***`
    const origin = pick(rng, ORIGIN_COUNTRIES)
    const city = pick(rng, US_CITIES)
    const months = 1 + Math.floor(rng() * 6)

    // Spread dates evenly from newest (i=0) to oldest, with small jitter.
    const t = END - ((END - START) * i) / TOTAL_ITEMS - Math.floor(rng() * 36) * 86400000
    const date = new Date(Math.max(START, t)).toISOString().slice(0, 10)

    const title = pick(rng, TITLE_TEMPLATES[category])
      .replace("{name}", name)
      .replace("{city}", city)
      .replace("{country}", origin.name)
    const excerpt = pick(rng, EXCERPT_TEMPLATES)
      .replace("{months}", String(months))

    items.push({
      id: i + 1,
      date,
      name,
      countryCode: origin.code,
      country: origin.name,
      city,
      category,
      categoryLabel: CATEGORY_LABELS[category],
      image: "", // assigned by display position below
      title,
      excerpt,
    })
  }
  // newest first
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

  // Assign images by final display position using a stride coprime to the
  // pool size. This guarantees that any window of IMAGES.length consecutive
  // cards (and therefore every page of the feed) shows unique images with no
  // adjacent repeats.
  const stride = 13 // coprime with 35
  for (let pos = 0; pos < items.length; pos++) {
    items[pos].image = IMAGES[(pos * stride) % IMAGES.length]
  }

  return items
}

export const NEWS_ITEMS: NewsItem[] = buildItems()

export function formatRuDate(iso: string): string {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ]
  const d = new Date(iso)
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
