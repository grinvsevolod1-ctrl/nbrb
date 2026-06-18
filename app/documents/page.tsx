import type { Metadata } from "next"
import {
  FileText,
  CheckCircle2,
  PenLine,
  ListChecks,
  AlertTriangle,
  ClipboardList,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { DocumentsForm } from "@/components/documents-form"

export const metadata: Metadata = {
  title: "Документы и подача заявки | Dissidentby",
  description:
    "Перечень необходимых документов, образец заявления и форма подачи данных для участия в программе помощи политзаключённым.",
}

const requiredDocuments = [
  "Действующий заграничный или внутренний паспорт (все заполненные страницы)",
  "Заявление, написанное от руки (образец ниже)",
  "Документы, подтверждающие статус политзаключённого или преследование",
  "Судебные постановления, приговоры или справки (при наличии)",
  "Подтверждение от правозащитной организации (при наличии)",
  "2 цветные фотографии 3.5×4.5 см на светлом фоне",
  "Свидетельства о браке / рождении детей (при наличии)",
]

const conditions = [
  "Возраст от 18 лет на момент подачи заявки",
  "Признанный статус политзаключённого либо документально подтверждённое политическое преследование",
  "Отсутствие действующего отказа во въезде в США",
  "Готовность пройти собеседование и предоставить оригиналы документов",
]

const steps = [
  "Соберите документы из перечня выше и подготовьте сканы или фотографии.",
  "Напишите от руки заявление по образцу, сфотографируйте его.",
  "Заполните форму ниже — внесите личные данные и контакты.",
  "Проверьте и подтвердите данные. Заявка придёт нашей команде.",
  "Подтвердите номер телефона на странице входа, чтобы отслеживать статус.",
]

export default function DocumentsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-background text-foreground">
        <PageHero
          eyebrow={
            <>
              <FileText className="size-3.5" aria-hidden="true" />
              Документы и подача
            </>
          }
          title={
            <>
              Документы и <span className="text-red-500">подача заявки</span>
            </>
          }
          description="Ниже — полный перечень документов, условия участия и образец заявления. После подготовки документов заполните форму, и мы начнём работу по вашему делу."
        />

        <div className="mx-auto w-full max-w-3xl px-5 pb-20">
          {/* Required documents */}
          <section>
            <div className="flex items-center gap-2">
              <ListChecks className="size-5 text-red-500" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">Необходимые документы</h2>
            </div>
            <ul className="mt-6 grid gap-3">
              {requiredDocuments.map((doc) => (
                <li
                  key={doc}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-red-500" aria-hidden="true" />
                  <span className="text-pretty text-sm leading-relaxed text-foreground/90">{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Conditions */}
          <section className="mt-14">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">Условия участия</h2>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {conditions.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-red-500" aria-hidden="true" />
                  <span className="text-pretty text-sm leading-relaxed text-foreground/90">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Handwritten application sample */}
          <section className="mt-14">
            <div className="flex items-center gap-2">
              <PenLine className="size-5 text-red-500" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">Заявление от руки</h2>
            </div>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Заявление пишется собственноручно, синей или чёрной ручкой, без
              исправлений. Перепишите образец ниже, подставив свои данные, поставьте
              дату и подпись, затем сфотографируйте лист и приложите к заявке.
            </p>

            {/* Sample "paper" */}
            <div className="mt-6 rounded-2xl border border-amber-200/20 bg-[#f6f1e7] p-6 text-[#2b2620] shadow-xl shadow-black/30 sm:p-8">
              <p className="text-right font-serif text-sm leading-relaxed">
                В организацию «Dissidentby»
                <br />
                от гражданина(ки) ____________________
                <br />
                (ФИО полностью)
              </p>
              <p className="mt-6 text-center font-serif text-lg font-semibold tracking-wide">
                ЗАЯВЛЕНИЕ
              </p>
              <p className="mt-5 font-serif text-[15px] leading-[1.9]">
                Я, ____________________________________ (ФИО), дата рождения
                __________, прошу оказать мне содействие в участии в гуманитарной
                программе по легализации в Соединённых Штатах Америки в связи с
                политическим преследованием на территории __________________.
              </p>
              <p className="mt-3 font-serif text-[15px] leading-[1.9]">
                Подтверждаю, что предоставленные мной сведения и документы являются
                достоверными. Даю согласие на обработку моих персональных данных в
                целях подготовки документов в рамках программы.
              </p>
              <p className="mt-3 font-serif text-[15px] leading-[1.9]">
                О себе сообщаю следующее: ________________________________________
                __________________________________________________________________
                (кратко — статус, статьи преследования, текущее положение).
              </p>
              <div className="mt-8 flex items-end justify-between font-serif text-[15px]">
                <span>«____» __________ 20___ г.</span>
                <span>Подпись ____________ / ___________ /</span>
              </div>
            </div>
          </section>

          {/* Process steps */}
          <section className="mt-14">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-5 text-red-500" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">Порядок подачи</h2>
            </div>
            <ol className="mt-6 space-y-3">
              {steps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-sm font-semibold text-red-500 tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-pretty text-sm leading-relaxed text-foreground/90">{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Form */}
          <section className="mt-14 scroll-mt-20" id="form">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-red-500" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">Анкета заявителя</h2>
            </div>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Заполните данные о себе. После проверки и подтверждения заявка вместе
              с контактами поступит нашей команде. Поля со звёздочкой обязательны.
            </p>
            <div className="mt-6">
              <DocumentsForm />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
