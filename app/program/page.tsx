import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  Scale,
  HeartHandshake,
  Plane,
  CheckCircle2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Программа Green Card для политзаключённых | Dissidentby",
  description:
    "Официальное соглашение Dissidentby с Министерством миграции США о помощи политическим заключённым в получении грин-карты.",
}

const steps = [
  {
    icon: FileCheck2,
    title: "Подача заявки",
    text: "Бывшие политзаключённые и преследуемые активисты заполняют анкету. Мы проверяем документы и подтверждаем статус.",
  },
  {
    icon: Scale,
    title: "Юридическое сопровождение",
    text: "Наши юристы готовят полный пакет документов и подают его напрямую через официальный канал Министерства миграции США.",
  },
  {
    icon: ShieldCheck,
    title: "Рассмотрение по приоритету",
    text: "В рамках соглашения дела рассматриваются по гуманитарной категории с ускоренным приоритетом.",
  },
  {
    icon: Plane,
    title: "Переезд и адаптация",
    text: "После одобрения мы помогаем с релокацией, размещением и первичной адаптацией в США.",
  },
]

const eligibility = [
  "Лица, признанные политическими заключёнными правозащитными организациями",
  "Бывшие политзаключённые режима Лукашенко",
  "Активисты и журналисты, подвергшиеся политическому преследованию",
  "Члены семей политзаключённых, находящиеся под угрозой",
]

export default function ProgramPage() {
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
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Официальная программа
          </span>

          <h1 className="mt-5 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Green Card для политзаключённых
          </h1>

          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Dissidentby заключила официальное соглашение с Министерством миграции
            США. В рамках партнёрства мы помогаем политическим заключённым и
            бывшим политзаключённым режима Лукашенко легально получить грин-карту
            и начать безопасную жизнь в Соединённых Штатах.
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <HeartHandshake className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Что это значит</h2>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                Соглашение открывает официальный гуманитарный канал. Это не
                лотерея и не общая очередь — дела наших подопечных рассматриваются
                индивидуально, с приоритетом и полным юридическим сопровождением
                на всех этапах.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Как проходит процесс</h2>
          <ol className="mt-5 space-y-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <step.icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium tabular-nums text-muted-foreground">
                      Шаг {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-1 font-medium">{step.title}</h3>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Кто может участвовать</h2>
          <ul className="mt-5 space-y-3">
            {eligibility.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-foreground/70"
                  aria-hidden="true"
                />
                <span className="text-pretty leading-relaxed text-foreground/90">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Подать заявку</h2>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Если вы или ваши близкие подпадаете под критерии программы, начните с
            подачи заявки. Мы свяжемся с вами для уточнения деталей и проверки
            документов.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Перейти к заявке
          </Link>
        </section>

        <footer className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          Dissidentby — правозащитная организация, помогающая политическим
          заключённым и пострадавшим от политических репрессий.
        </footer>
      </div>
    </main>
  )
}
