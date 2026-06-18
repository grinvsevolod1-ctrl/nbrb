import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Новости | Green Card 2026",
  description: "Свежие новости из Америки",
}

export default function NewsPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          На главную
        </Link>

        <header className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            США
          </span>

          <h1 className="mt-5 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            NASA подтвердило успешную стыковку миссии Artemis II с лунной орбитальной станцией
          </h1>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" />
            <time dateTime="2026-06-18">18 июня 2026</time>
            <span aria-hidden="true">•</span>
            <span>Хьюстон, Техас</span>
          </div>
        </header>

        <article className="mt-8 space-y-5 text-pretty leading-relaxed text-foreground/90">
          <p>
            Космическое агентство NASA сообщило, что экипаж миссии Artemis II успешно завершил
            маневр сближения и стыковки с новой орбитальной станцией Gateway, находящейся на
            окололунной орбите. Это первая пилотируемая стыковка человека у Луны за более чем
            пятьдесят лет.
          </p>

          <p>
            Команда из четырех астронавтов провела на станции серию научных экспериментов,
            включая тестирование систем жизнеобеспечения, которые в будущем планируется
            использовать для длительных экспедиций на Марс. По словам руководителей полета в
            Космическом центре имени Джонсона в Хьюстоне, все системы корабля работали штатно.
          </p>

          <blockquote className="border-l-2 border-border pl-4 text-lg italic text-foreground/80">
            «Сегодня мы сделали еще один шаг к возвращению человека на Луну и подготовке к
            покорению дальнего космоса», — заявил администратор NASA на пресс-конференции.
          </blockquote>

          <p>
            Возвращение экипажа на Землю запланировано на конец месяца. Капсула приводнится в
            Тихом океане недалеко от побережья Калифорнии, где ее будут ждать спасательные суда
            ВМС США. Следующая миссия, Artemis III, должна доставить астронавтов уже на
            поверхность Луны.
          </p>
        </article>

        <footer className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          Материал подготовлен на основе открытых источников и носит демонстрационный характер.
        </footer>
      </div>
    </main>
  )
}
