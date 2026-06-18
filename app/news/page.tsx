import type { Metadata } from "next"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WorldHelpMap } from "@/components/world-help-map"
import { NewsFeed } from "@/components/news-feed"
import { STATS } from "@/lib/news-data"

export const metadata: Metadata = {
  title: "Новости и истории помощи | Dissidentby",
  description:
    "Хроника работы Dissidentby с 10 января 2024 года: политические эмигранты, получившие визы, убежище и грин-карты в США. Имена изменены, личные данные не публикуются.",
}

const stats = [
  { value: STATS.totalHelped.toLocaleString("ru-RU"), label: "человек получили помощь" },
  { value: `${STATS.countries}`, label: "стран происхождения" },
  { value: `${STATS.approvalRate}%`, label: "одобрено по гуманитарным делам" },
  { value: STATS.sinceLabel, label: "работаем с этой даты" },
]

export default function NewsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-background text-foreground">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0">
            <Image
              src="/news/hero.png"
              alt=""
              fill
              priority
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-600/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-red-300">
              Хроника помощи
            </span>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              Истории тех, кто обрёл свободу
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              С 10 января 2024 года Dissidentby сопровождает политических
              эмигрантов на пути к легальному статусу в США — гуманитарные визы,
              политическое убежище, грин-карты и воссоединение семей. Имена
              изменены, фамилии скрыты, личные данные не публикуются.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur"
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
                    {s.value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-5 py-14">
          {/* Map */}
          <section>
            <div className="max-w-2xl">
              <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
                Карта помощи
              </span>
              <h2 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">
                Откуда приезжают наши подопечные
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                Наведите курсор на отметку, чтобы увидеть число людей, которым мы
                помогли из этой страны. Размер точки отражает количество дел.
              </p>
            </div>
            <div className="mt-8">
              <WorldHelpMap />
            </div>
          </section>

          {/* Feed */}
          <section className="mt-16">
            <div className="max-w-2xl">
              <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
                Лента событий
              </span>
              <h2 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">
                Последние одобренные дела
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                Каждая запись — реальный результат работы команды. Фотографии
                нейтральные, персональные данные не раскрываются.
              </p>
            </div>
            <div className="mt-8">
              <NewsFeed />
            </div>
          </section>

          <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
            Материалы носят демонстрационный характер. Имена изменены, фамилии
            зашифрованы, любые совпадения случайны. Мы никогда не публикуем
            персональные данные подопечных.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
