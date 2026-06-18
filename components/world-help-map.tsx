"use client"

import { useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps"
import { ORIGIN_COUNTRIES, STATS, type OriginCountry } from "@/lib/news-data"

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const maxHelped = Math.max(...ORIGIN_COUNTRIES.map((c) => c.helped))

function radiusFor(helped: number) {
  // sqrt scale so area is proportional to count
  const min = 4
  const max = 16
  return min + (max - min) * Math.sqrt(helped / maxHelped)
}

export function WorldHelpMap() {
  const [active, setActive] = useState<OriginCountry | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)

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
            setActive(null)
            setTooltip(null)
          }}
        >
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 170 }}
            width={820}
            height={420}
            style={{ width: "100%", height: "auto" }}
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
              const r = radiusFor(country.helped)
              const isActive = active?.code === country.code
              return (
                <Marker
                  key={country.code}
                  coordinates={country.coordinates}
                  onMouseEnter={(e: React.MouseEvent) => {
                    setActive(country)
                    const rect = (
                      e.currentTarget.ownerSVGElement?.parentElement as HTMLElement
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
                      e.currentTarget.ownerSVGElement?.parentElement as HTMLElement
                    )?.getBoundingClientRect()
                    if (rect) {
                      setTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      })
                    }
                  }}
                >
                  <circle
                    r={r + 6}
                    fill="rgb(220 38 38 / 0.15)"
                    className={isActive ? "animate-pulse-slow" : ""}
                  />
                  <circle
                    r={r}
                    fill={isActive ? "rgb(248 113 113)" : "rgb(220 38 38)"}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth={isActive ? 1.5 : 0.75}
                    style={{ cursor: "pointer", transition: "fill 0.15s" }}
                  />
                </Marker>
              )
            })}
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
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="border-t border-border p-6 lg:border-l lg:border-t-0">
          <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
            География помощи
          </span>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
            {STATS.totalHelped.toLocaleString("ru-RU")}
          </p>
          <p className="text-sm text-muted-foreground">
            человек поддержано из {STATS.countries} стран
          </p>

          <ul className="mt-5 space-y-1.5">
            {[...ORIGIN_COUNTRIES]
              .sort((a, b) => b.helped - a.helped)
              .map((c) => {
                const isActive = active?.code === c.code
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(c)}
                      onMouseLeave={() => setActive(null)}
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
