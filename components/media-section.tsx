import { Newspaper, Radio, Globe2, Building2, BookOpen, Mic } from "lucide-react"

const mentions = [
  { icon: Newspaper, name: "Свободные Медиа" },
  { icon: Radio, name: "Радио Свобода" },
  { icon: Globe2, name: "Human Rights Watch" },
  { icon: Building2, name: "Amnesty International" },
  { icon: BookOpen, name: "Viasna" },
  { icon: Mic, name: "Эхо" },
]

export function MediaSection() {
  return (
    <section className="mt-16 rounded-3xl border border-border bg-card/50 p-8 sm:p-10">
      <div className="text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
          Нам доверяют
        </span>
        <h2 className="mt-2 text-balance text-xl font-semibold sm:text-2xl">
          Нас поддерживают и о нас пишут
        </h2>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {mentions.map((item) => (
          <li
            key={item.name}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/60 px-3 py-5 text-center transition-colors hover:border-red-500/40"
          >
            <item.icon className="size-6 text-red-500/90" aria-hidden="true" />
            <span className="text-pretty text-xs font-medium leading-tight text-foreground/80">
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
