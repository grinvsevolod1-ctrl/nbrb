"use client"

import { useState, useCallback } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps"
import { Plus, Minus, Locate, MousePointerClick } from "lucide-react"
import { ORIGIN_COUNTRIES, STATS, type OriginCountry } from "@/lib/news-data"

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const maxHelped = Math.max(...ORIGIN_COUNTRIES.map((c) => c.helped))

const CATEGORY_BREAKDOWN = [
  { key: "humanitarian", label: "Гуманитарная виза", weight: 0.34 },
  { key: "asylum", label: "Политическое убежище", weight: 0.28 },
  { key: "greencard", label: "Грин-карта", weight: 0.18 },
  { key: "reunification", label: "Воссоединение семьи", weight: 0.12 },
  { key: "work", label: "Рабочая виза", weight: 0.08 },
]

// Deterministic per-country breakdown so each country looks distinct.
function breakdownFor(country: OriginCountry) {
  const seed = country.code.charCodeAt(0) + country.code.charCodeAt(1)
  return CATEGORY_BREAKDOWN.map((c, i) => {
    const jitter = (((seed * (i + 3)) % 9) - 4) / 100 // -0.04..0.04
    const share = Math.max(0.02, c.weight + jitter)
    return { label: c.label, count: Math.round(country.helped * share) }
  })
}

function radiusFor(helped: number) {
  const min = 4
  const max = 16
  return min + (max - min) * Math.sqrt(helped / maxHelped)
}

const DEFAULT_CENTER: [number, number] = [50, 45]
const DEFAULT_ZOOM = 1
const MIN_ZOOM = 1
const MAX_ZOOM = 8

export function WorldHelpMap() {
  const [active, setActive] = useState<OriginCountry | null>(null)
  const [selected, setSelected] = useState<OriginCountry | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const [position, setPosition] = useState<{
    coordinates: [number, number]
    zoom: number
  }>({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })

  const handleMoveEnd = useCallback(
    (pos: { coordinates: [number, number]; zoom: number }) => {
      setPosition(pos)
    },
    [],
  )

  const zoomIn = () =>
    setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.6, MAX_ZOOM) }))
  const zoomOut = () =>
    setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.6, MIN_ZOOM) }))
  const resetView = () => {
    setSelected(null)
    setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
  }

  const focusCountry = (country: OriginCountry) => {
    setSelected(country)
    setActive(country)
    setPosition({ coordinates: country.coordinates, zoom: 4 })
  }

  const detail = selected ?? active

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
      {/* subtle red glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]"
      />

      <div className="relative grid gap-0 lg:grid-cols-[1fr_300px]">
        {/* Map */}
        <div
          className="relative"
          onMouseLeave={() => {
            setActive(selected)
            setTooltip(null)
          }}
        >
          {/* Hint */}
          <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <MousePointerClick className="size-3.5" aria-hidden="true" />
            Колесо — масштаб, перетаскивание — движение
          </div>

          {/* Zoom controls */}
          <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={zoomIn}
              aria-label="Приблизить"
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-red-600 hover:text-white"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={zoomOut}
              aria-label="Отдалить"
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-red-600 hover:text-white"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label="Сбросить вид"
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-red-600 hover:text-white"
            >
              <Locate className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Zoom level indicator */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full border border-border bg-background/70 px-3 py-1 text-xs tabular-nums text-muted-foreground backdrop-blur">
            {position.zoom.toFixed(1)}×
          </div>

          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 170 }}
            width={820}
            height={420}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup
              center={position.coordinates}
              zoom={position.zoom}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              onMoveEnd={handleMoveEnd}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "rgba(255,255,255,0.05)",
                          stroke: "rgba(255,255,255,0.12)",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "rgba(255,255,255,0.08)",
                          stroke: "rgba(255,255,255,0.18)",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {ORIGIN_COUNTRIES.map((country) => {
                const r = radiusFor(country.helped) / Math.sqrt(position.zoom)
                const isActive = active?.code === country.code
                const isSelected = selected?.code === country.code
                return (
                  <Marker
                    key={country.code}
                    coordinates={country.coordinates}
                    onMouseEnter={(e: React.MouseEvent) => {
                      setActive(country)
                      const rect = (
                        e.currentTarget.ownerSVGElement
                          ?.parentElement as HTMLElement
                      )?.getBoundingClientRect()
                      if (rect) {
                        setTooltip({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        })
                      }
                    }}
                    onMouseMove={(e: React.MouseEvent) => {
                      const rect = (
                        e.currentTarget.ownerSVGElement
                          ?.parentElement as HTMLElement
                      )?.getBoundingClientRect()
                      if (rect) {
                        setTooltip({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        })
                      }
                    }}
                    onClick={() => focusCountry(country)}
                  >
                    <circle
                      r={r + 6 / Math.sqrt(position.zoom)}
                      fill="rgb(220 38 38 / 0.15)"
                      className={isActive ? "animate-pulse-slow" : ""}
                    />
                    <circle
                      r={r}
                      fill={
                        isActive || isSelected
                          ? "rgb(248 113 113)"
                          : "rgb(220 38 38)"
                      }
                      stroke={
                        isSelected
                          ? "rgb(255 255 255)"
                          : "rgba(255,255,255,0.6)"
                      }
                      strokeWidth={
                        (isActive || isSelected ? 1.5 : 0.75) /
                        Math.sqrt(position.zoom)
                      }
                      style={{ cursor: "pointer", transition: "fill 0.15s" }}
                    />
                  </Marker>
                )
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {active && tooltip && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-xl border border-red-500/30 bg-popover/95 px-3 py-2 shadow-xl backdrop-blur"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <p className="text-sm font-semibold text-foreground">
                {active.name}
              </p>
              <p className="text-xs text-red-400">
                {active.helped.toLocaleString("ru-RU")} человек получили помощь
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Нажмите, чтобы приблизить
              </p>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="border-t border-border p-6 lg:border-l lg:border-t-0">
          <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
            География помощи
          </span>

          {detail ? (
            <div className="mt-2">
              <p className="text-xl font-semibold text-foreground">
                {detail.name}
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-red-400">
                {detail.helped.toLocaleString("ru-RU")}
              </p>
              <p className="text-sm text-muted-foreground">человек получили помощь</p>

              <div className="mt-4 space-y-2">
                {breakdownFor(detail).map((b) => {
                  const pct = Math.round((b.count / detail.helped) * 100)
                  return (
                    <div key={b.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className="tabular-nums font-medium text-foreground/90">
                          {b.count.toLocaleString("ru-RU")}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-accent">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {selected && (
                <button
                  type="button"
                  onClick={resetView}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Locate className="size-3.5" aria-hidden="true" />
                  Показать всю карту
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
                {STATS.totalHelped.toLocaleString("ru-RU")}
              </p>
              <p className="text-sm text-muted-foreground">
                человек поддержано из {STATS.countries} стран
              </p>
            </>
          )}

          <ul className="mt-5 space-y-1.5">
            {[...ORIGIN_COUNTRIES]
              .sort((a, b) => b.helped - a.helped)
              .map((c) => {
                const isActive = detail?.code === c.code
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(c)}
                      onMouseLeave={() => setActive(selected)}
                      onClick={() => focusCountry(c)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-red-600/15 text-foreground"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block size-2 rounded-full bg-red-500"
                        />
                        {c.name}
                      </span>
                      <span className="tabular-nums font-medium text-foreground/90">
                        {c.helped.toLocaleString("ru-RU")}
                      </span>
                    </button>
                  </li>
                )
              })}
          </ul>
        </div>
      </div>
    </div>
  )
}
