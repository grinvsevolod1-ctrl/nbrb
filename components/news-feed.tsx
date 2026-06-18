"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Search, MapPin, CalendarDays } from "lucide-react"
import {
  NEWS_ITEMS,
  CATEGORY_FILTERS,
  formatRuDate,
  type NewsCategory,
} from "@/lib/news-data"

const PAGE_SIZE = 24

export function NewsFeed() {
  const [category, setCategory] = useState<NewsCategory | "all">("all")
  const [query, setQuery] = useState("")
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return NEWS_ITEMS.filter((item) => {
      if (category !== "all" && item.category !== category) return false
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
      )
    })
  }, [category, query])

  const shown = filtered.slice(0, visible)

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((f) => {
            const isActive = category === f.value
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setCategory(f.value)
                  setVisible(PAGE_SIZE)
                }}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-red-500/40 bg-red-600/20 text-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="relative w-full lg:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisible(PAGE_SIZE)
            }}
            placeholder="Поиск по имени, стране, городу"
            aria-label="Поиск по новостям"
            className="w-full rounded-full border border-border bg-input py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-red-500/40"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Найдено: <span className="tabular-nums text-foreground">{filtered.length}</span> публикаций
      </p>

      {/* Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <article
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-red-500/30"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full border border-red-500/30 bg-black/60 px-2.5 py-1 text-xs font-medium text-red-300 backdrop-blur">
                {item.categoryLabel}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  <time dateTime={item.date}>{formatRuDate(item.date)}</time>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {item.country}
                </span>
              </div>

              <h3 className="mt-3 text-pretty font-semibold leading-snug text-foreground">
                {item.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.excerpt}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-medium text-foreground/90">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground">{item.city}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Показать ещё
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          Ничего не найдено. Попробуйте изменить запрос.
        </p>
      )}
    </div>
  )
}
