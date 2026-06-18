import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Scale,
  HeartHandshake,
  Plane,
  CheckCircle2,
  Quote,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { StoriesSection } from "@/components/stories-section"
import { MediaSection } from "@/components/media-section"
import { FaqSection } from "@/components/faq-section"
import { ContactForm } from "@/components/contact-form"

const stats = [
  { value: "1 месяц", label: "средний срок одобрения" },
  { value: "3–4 дня", label: "примерный срок первого ответа" },
  { value: "94%", label: "одобрено по гуманитарной категории" },
]

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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-background text-foreground">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/program/hero-liberty.png"
              alt="Статуя Свободы на фоне драматичного неба"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.35),transparent_60%)]" />
          </div>

          <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-20 sm:pb-24 sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-red-400">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Официальная программа
            </span>

            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Green Card для{" "}
              <span className="text-red-500">политзаключённых</span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-foreground/70 sm:text-lg">
              Dissidentby заключила официальное соглашение с Министерством
              миграции США. Мы помогаем политическим заключённым и бывшим
              политзаключённым режима Лукашенко легально получить грин-карту и
              начать безопасную жизнь в Соединённых Штатах.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/lottery"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition-colors hover:bg-red-500"
              >
                Подать заявку
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#process"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Как это работает
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-3xl px-5">
          {/* Stats */}
          <section className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-6 text-center">
                <div className="text-3xl font-semibold text-red-500 tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground text-balance">
                  {stat.label}
                </div>
              </div>
            ))}
          </section>

          {/* What it means */}
          <section className="mt-14 grid items-center gap-8 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/program/agreement.png"
                alt="Официальный документ соглашения с американским флагом"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10">
                <HeartHandshake className="size-6 text-red-500" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Что это значит</h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                Соглашение открывает официальный гуманитарный канал. Это не
                лотерея и не общая очередь — дела наших подопечных
                рассматриваются индивидуально, с приоритетом и полным
                юридическим сопровождением на всех этапах.
              </p>
            </div>
          </section>

          {/* Process */}
          <section id="process" className="mt-16 scroll-mt-20">
            <h2 className="text-2xl font-semibold">Как проходит процесс</h2>
            <p className="mt-2 text-muted-foreground">
              Четыре шага от заявки до без��пасной жизни в США.
            </p>
            <ol className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-red-500/40"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                    <step.icon className="size-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-red-500/80 tabular-nums">
                      Шаг {index + 1}
                    </span>
                    <h3 className="mt-1 font-medium">{step.title}</h3>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Quote with image */}
          <section className="relative mt-16 overflow-hidden rounded-2xl border border-border">
            <Image
              src="/program/freedom.png"
              alt="Руки на тюремной решётке с пробивающимся светом свободы"
              width={1200}
              height={675}
              className="h-64 w-full object-cover sm:h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <Quote className="size-7 text-red-500" aria-hidden="true" />
              <blockquote className="mt-3 max-w-xl text-balance text-lg font-medium leading-snug sm:text-xl">
                «Свобода не должна заканчиваться у тюремных ворот. Наша задача —
                превратить освобождение в новое начало».
              </blockquote>
              <p className="mt-2 text-sm text-muted-foreground">
                Команда Dissidentby
              </p>
            </div>
          </section>

          {/* Stories */}
          <StoriesSection />

          {/* Media / supporters */}
          <MediaSection />

          {/* Eligibility */}
          <section className="mt-16">
            <h2 className="text-2xl font-semibold">Кто может участвовать</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {eligibility.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-red-500"
                    aria-hidden="true"
                  />
                  <span className="text-pretty text-sm leading-relaxed text-foreground/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <FaqSection />

          {/* Quick contact */}
          <section className="mt-16 rounded-3xl border border-border bg-card p-6 sm:p-10">
            <div className="max-w-2xl">
              <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
                Быстрая связь
              </span>
              <h2 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">
                Напишите нам напрямую
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                Оставьте имя и удобный способ связи — ответим в течение 3–4 дней.
                Сообщение придёт напрямую нашей команде. Все обращения
                конфиденциальны.
              </p>
            </div>
            <div className="mt-8">
              <ContactForm />
            </div>
          </section>

          {/* CTA */}
          <section className="relative mt-16 overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-600/20 via-card to-card p-8 sm:p-10">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_100%_0%,rgba(220,38,38,0.25),transparent_55%)]" />
            <h2 className="text-balance text-2xl font-semibold sm:text-3xl">
              Подать заявку на программу
            </h2>
            <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Если вы или ваши близкие подпадаете под критерии программы, начните
              с подачи заявки. Мы свяжемся с вами для уточнения деталей и
              проверки документов. Все обращения конфиденциальны.
            </p>
            <Link
              href="/lottery"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition-colors hover:bg-red-500"
            >
              Перейти к заявке
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>

          <div className="h-16" />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
