"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Кто может подать заявку на программу?",
    a: "Бывшие и нынешние политические заключённые, активисты и журналисты, подвергшиеся политическому преследованию, а также члены их семей, находящиеся под угрозой. Статус подтверждается правозащитными организациями.",
  },
  {
    q: "Сколько занимает рассмотрение?",
    a: "Средний срок одобрения по гуманитарной категории — около 1 месяца. Первичный ответ по вашему обращению мы даём в течение 3–4 дней.",
  },
  {
    q: "Это лотерея или гарантированная программа?",
    a: "Это не лотерея. В рамках официального соглашения с Министерством миграции США дела рассматриваются индивидуально, по гуманитарной категории, с приоритетом и полным юридическим сопровождением.",
  },
  {
    q: "Сколько стоит участие?",
    a: "Юридическое сопровождение для подопечных программы бесплатно. Мы — некоммерческая правозащитная организация и существуем на пожертвования.",
  },
  {
    q: "Насколько это конфиденциально?",
    a: "Все обращения строго конфиденциальны. Данные передаются только уполномоченным юристам и в официальный канал миграционной службы. Мы не публикуем личную информацию без вашего согласия.",
  },
  {
    q: "Что делать, если я ещё нахожусь в стране риска?",
    a: "Напишите нам через защищённый Telegram-бот. Мы подскажем безопасные шаги и поможем подготовиться к подаче, не подвергая вас дополнительной опасности.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="mt-16">
      <div className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-wider text-red-500/80">
          Вопросы и ответы
        </span>
        <h2 className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">
          Частые вопросы о программе
        </h2>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = open === index
          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-2xl border border-border bg-card transition-colors data-[open=true]:border-red-500/40"
              data-open={isOpen}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-pretty font-medium">{faq.q}</span>
                <ChevronDown
                  className={`size-5 shrink-0 text-red-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
