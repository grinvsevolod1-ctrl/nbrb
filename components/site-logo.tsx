type SiteLogoProps = {
  className?: string
}

/**
 * Dissidentby mark: an inverted (point-down) triangle that appears to be
 * bleeding / dripping, matching the dark + red brand aesthetic.
 */
export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <svg
      viewBox="0 0 64 80"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="blood-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="55%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <radialGradient id="blood-glow" cx="50%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft glow behind the mark */}
      <circle cx="32" cy="22" r="26" fill="url(#blood-glow)" />

      {/* main inverted triangle with uneven, oozing bottom edges */}
      <path
        fill="url(#blood-fill)"
        d="M4 6
           C 4 4, 6 3, 9 3
           L 55 3
           C 58 3, 60 4, 60 6
           C 56 14, 50 24, 44 33
           C 42 40, 41 47, 38 47
           C 36 47, 36 42, 34 41
           C 33 49, 32 58, 30 58
           C 28 58, 28 50, 27 44
           C 24 42, 23 36, 22 32
           C 15 23, 9 14, 4 6 Z"
      />

      {/* drips clinging to the underside */}
      <path
        fill="url(#blood-fill)"
        d="M38 46
           C 41 46, 41 56, 39 60
           C 38 63, 35 63, 34 60
           C 33 55, 35 46, 38 46 Z"
      />
      <path
        fill="url(#blood-fill)"
        d="M30 57
           C 33 57, 33 70, 31 74
           C 30 77, 27 77, 26 74
           C 25 68, 27 57, 30 57 Z"
      />

      {/* detached falling droplet */}
      <ellipse cx="44" cy="55" rx="2.4" ry="3.4" fill="#dc2626" />
    </svg>
  )
}
