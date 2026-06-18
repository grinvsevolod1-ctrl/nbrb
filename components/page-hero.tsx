import type { ReactNode } from "react"
import Image from "next/image"

interface PageHeroProps {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Optional background image path. Falls back to a pure red-gradient hero. */
  image?: string
  imageAlt?: string
  /** Tightens vertical padding for lighter sub-pages. */
  compact?: boolean
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  image,
  imageAlt = "",
  compact = false,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {image ? (
          <Image src={image} alt={imageAlt} fill priority className="object-cover" />
        ) : null}
        {/* Base wash so content stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        {/* Signature red bloom that bleeds up into the transparent header */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(220,38,38,0.45),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      </div>

      <div
        className={`mx-auto w-full max-w-3xl px-5 ${
          compact ? "pb-12 pt-16 sm:pb-16 sm:pt-20" : "pb-16 pt-20 sm:pb-24 sm:pt-28"
        }`}
      >
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-red-400">
            {eyebrow}
          </span>
        ) : null}

        <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-foreground/70 sm:text-lg">
            {description}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  )
}
