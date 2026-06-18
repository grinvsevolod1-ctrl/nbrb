import type { Metadata } from "next"
import { Send, Mail, Bot, Building2, Landmark } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { PageHero } from "@/components/page-hero"

export const metadata: Metadata = {
  title: "Связаться с нами | Dissidentby",
  description:
    "Свяжитесь с Dissidentby через Telegram, email или форму обратной связи. Все обращения конфиденциальны.",
}

const bankAccounts = [
  { label: "EUR", value: "PL46 1020 4027 0000 1402 1816 5760" },
  { label: "USD", value: "PL19 1020 4027 0000 1802 1816 5759" },
  { label: "PLN", value: "PL26 1020 4027 0000 1402 1816 1561" },
]

export default function ContactsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-background text-foreground">
        <PageHero
          compact
          eyebrow={
            <>
              <Send className="size-3.5" aria-hidden="true" />
              Контакты
            </>
          }
          title="Связаться с нами"
          description="Для связи с нами вы можете написать в Telegram или воспользоваться формой ниже. Пожалуйста, опишите коротко ваш запрос, чтобы мы могли точнее и оперативнее ответить. Все обращения конфиденциальны."
        />

        <div className="mx-auto w-full max-w-3xl px-5 pb-14">
          {/* Quick contact channels */}
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://t.me/dissidentby_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-red-500/40"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <Bot className="size-5 text-red-500" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-medium">Наш Telegram-бот</h2>
                <p className="mt-1 text-sm text-muted-foreground">@dissidentby_bot</p>
                <span className="mt-2 inline-block text-sm font-medium text-red-400 transition-colors group-hover:text-red-300">
                  Написать в Telegram
                </span>
              </div>
            </a>

            <a
              href="mailto:imdissidentby@gmail.com"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-red-500/40"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <Mail className="size-5 text-red-500" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-medium">Электронная почта</h2>
                <p className="mt-1 text-sm text-muted-foreground">imdissidentby@gmail.com</p>
                <span className="mt-2 inline-block text-sm font-medium text-red-400 transition-colors group-hover:text-red-300">
                  Написать письмо
                </span>
              </div>
            </a>
          </div>

          {/* Form */}
          <section className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Форма обратной связи</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Оставьте имя и удобный способ связи — ответим в течение 3–4 дней.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </section>

          {/* Organization details */}
          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-red-500">
                <Building2 className="size-5" aria-hidden="true" />
                <h2 className="font-medium text-foreground">Организация</h2>
              </div>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                Fundacja Wspierania Więźniów Politycznych «Dissidentby»
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                KRS <span className="font-mono text-foreground/80">0001003710</span>
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-red-500">
                <Landmark className="size-5" aria-hidden="true" />
                <h2 className="font-medium text-foreground">Счёт организации</h2>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {bankAccounts.map((acc) => (
                  <li key={acc.label} className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
                      {acc.label}
                    </span>
                    <span className="font-mono text-sm text-foreground/80">{acc.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
