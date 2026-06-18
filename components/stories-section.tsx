import { Quote, EyeOff } from "lucide-react"

const stories = [
  {
    name: "Алексей М.",
    role: "Бывший политзаключённый, 4 года заключения",
    quote:
      "После освобождения я не знал, как жить дальше. Команда помогла собрать документы и пройти весь путь. Сейчас я в безопасности и снова могу работать.",
  },
  {
    name: "Марина К.",
    role: "Журналистка, преследовалась за публикации",
    quote:
      "Меня поддержали на каждом шаге — от юридической консультации до переезда. Впервые за годы я перестала бояться стука в дверь.",
  },
  {
    name: "Виктор С.",
    role: "Активист, член семьи политзаключённого",
    quote:
      "Я думал, что гуманитарная виза — это что-то недостижимое. Благодаря официальному соглашению моё дело рассмотрели за несколько недель.",
  },
]

export function StoriesSection() {
  return (
    <section className="mt-16">
      <div className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
          Реальные истории
        </span>
        <h2 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">
          Освобождение — это только начало
        </h2>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          За каждым делом — человек, который смог начать заново. Имена изменены,
          лица скрыты по просьбе героев — истории реальны.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <figure
            key={story.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-red-500/40"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-red-950/40 via-card to-card">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
                  <EyeOff className="size-6 text-red-500" aria-hidden="true" />
                </div>
                <span className="px-4 text-xs leading-relaxed text-muted-foreground">
                  По просьбе героя лицо скрыто
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>
            <figcaption className="flex flex-1 flex-col p-5">
              <Quote className="size-6 text-red-500" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                {story.quote}
              </blockquote>
              <div className="mt-4 border-t border-border pt-4">
                <div className="font-medium">{story.name}</div>
                <div className="text-xs text-muted-foreground">{story.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
