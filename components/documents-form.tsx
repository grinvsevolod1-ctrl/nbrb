"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Phone,
  AlertCircle,
  Upload,
  ImageIcon,
  X,
} from "lucide-react"

const MAX_PHOTO_BYTES = 8 * 1024 * 1024 // 8 MB

type Step = "form" | "confirm" | "success"

interface FieldDef {
  name: string
  label: string
  type?: "text" | "tel" | "email" | "date" | "textarea"
  required?: boolean
  placeholder?: string
  full?: boolean
}

interface Section {
  title: string
  fields: FieldDef[]
}

const sections: Section[] = [
  {
    title: "Личные данные",
    fields: [
      { name: "lastName", label: "Фамилия", required: true, placeholder: "Иванов" },
      { name: "firstName", label: "Имя", required: true, placeholder: "Иван" },
      { name: "middleName", label: "Отчество", placeholder: "Иванович" },
      { name: "birthDate", label: "Дата рождения", type: "date", required: true },
      { name: "birthPlace", label: "Место рождения", placeholder: "г. Минск", full: true },
      { name: "citizenship", label: "Гражданство", placeholder: "Беларусь" },
      { name: "maritalStatus", label: "Семейное положение", placeholder: "Холост / замужем" },
    ],
  },
  {
    title: "Документы",
    fields: [
      { name: "passport", label: "Серия и номер паспорта", placeholder: "MP1234567", required: true },
      { name: "passportIssuer", label: "Кем выдан", placeholder: "Орган выдачи", full: true },
      { name: "address", label: "Адрес проживания", placeholder: "Город, улица, дом, квартира", full: true },
    ],
  },
  {
    title: "Контакты",
    fields: [
      { name: "phonePrimary", label: "Основной телефон", type: "tel", required: true, placeholder: "+375 ..." },
      { name: "phoneSecondary", label: "Дополнительный телефон", type: "tel", placeholder: "+48 ..." },
      { name: "phoneRelative", label: "Телефон родственника", type: "tel", placeholder: "+375 ..." },
      { name: "email", label: "Email", type: "email", placeholder: "you@email.com" },
      { name: "telegram", label: "Telegram", placeholder: "@username" },
    ],
  },
  {
    title: "Статус и обстоятельства",
    fields: [
      { name: "education", label: "Образование", placeholder: "Высшее, специальность" },
      { name: "occupation", label: "Род деятельности", placeholder: "Кем работаете" },
      {
        name: "prisonerStatus",
        label: "Статус политзаключённого",
        placeholder: "Признан / бывший / член семьи",
        full: true,
      },
      {
        name: "persecutionPeriod",
        label: "Период преследования / заключения",
        placeholder: "Например: 2020–2023",
        full: true,
      },
      {
        name: "details",
        label: "Дополнительная информация",
        type: "textarea",
        placeholder: "Кратко опишите вашу ситуацию, статьи преследования, текущее положение.",
        full: true,
      },
    ],
  },
]

const allFields = sections.flatMap((s) => s.fields)

type FormState = Record<string, string>

const initialState: FormState = Object.fromEntries(allFields.map((f) => [f.name, ""]))

export function DocumentsForm() {
  const [step, setStep] = useState<Step>("form")
  const [data, setData] = useState<FormState>(initialState)
  const [agree, setAgree] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (name: string, value: string) => {
    setData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handlePhoto = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Прикрепите изображение (JPG, PNG или HEIC).")
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("Файл слишком большой. Максимальный размер — 8 МБ.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setPhoto({ name: file.name, dataUrl: String(reader.result) })
      setError("")
    }
    reader.onerror = () => setError("Не удалось прочитать файл. Попробуйте другой.")
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhoto(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Scroll to the form section (not the page top) after a step change, once
  // the new step content has been laid out.
  const scrollToForm = () => {
    requestAnimationFrame(() => {
      document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  const requiredMissing = allFields
    .filter((f) => f.required)
    .some((f) => !data[f.name].trim())

  const goConfirm = () => {
    if (requiredMissing) {
      setError("Заполните все обязательные поля, отмеченные звёздочкой.")
      return
    }
    if (!photo) {
      setError("Прикрепите фотографию рукописного заявления.")
      return
    }
    if (!agree) {
      setError("Подтвердите согласие на обработку данных.")
      return
    }
    setError("")
    setStep("confirm")
    scrollToForm()
  }

  const submit = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          applicationPhoto: photo?.dataUrl ?? "",
          applicationPhotoName: photo?.name ?? "",
        }),
      })
      const json = await res.json()
      if (json.success) {
        setStep("success")
        scrollToForm()
      } else {
        setError(json.error || "Не удалось отправить заявку. Попробуйте позже.")
      }
    } catch {
      setError("Ошибка соединения. Попробуйте позже.")
    } finally {
      setIsLoading(false)
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-border bg-secondary px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-red-500/40"

  // --- FORM STEP ---
  if (step === "form") {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <fieldset key={section.title}>
              <legend className="text-xs font-medium uppercase tracking-wider text-red-500/80">
                {section.title}
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.name} className={field.full ? "sm:col-span-2" : ""}>
                    <label htmlFor={field.name} className="mb-1.5 block text-sm text-muted-foreground">
                      {field.label}
                      {field.required && <span className="text-red-500"> *</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        rows={4}
                        value={data[field.name]}
                        onChange={(e) => update(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`${fieldClass} resize-y`}
                      />
                    ) : (
                      <input
                        id={field.name}
                        type={field.type ?? "text"}
                        value={data[field.name]}
                        onChange={(e) => update(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={fieldClass}
                      />
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          ))}

          <fieldset>
            <legend className="text-xs font-medium uppercase tracking-wider text-red-500/80">
              Фотография заявления
            </legend>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Прикрепите чёткое фото рукописного заявления, написанного по
              образцу выше. Текст должен быть полностью читаемым.
              <span className="text-red-500"> *</span>
            </p>

            {photo ? (
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-secondary/40 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.dataUrl || "/placeholder.svg"}
                  alt="Предпросмотр заявления"
                  className="size-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <ImageIcon className="size-4 shrink-0 text-red-500" aria-hidden="true" />
                    <span className="truncate">{photo.name}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Фото прикреплено</p>
                </div>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400"
                  aria-label="Удалить фото"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/30 px-4 py-8 text-center transition-colors hover:border-red-500/40 hover:bg-secondary/50"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-red-500/10">
                  <Upload className="size-5 text-red-500" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  Нажмите, чтобы загрузить фото
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG или HEIC, до 8 МБ
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handlePhoto(e.target.files?.[0])}
              className="sr-only"
            />
          </fieldset>
        </div>

        <label className="mt-8 flex items-start gap-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 rounded border-border bg-secondary accent-red-600"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            Я подтверждаю достоверность указанных данных и даю согласие на их
            обработку для подготовки документов в рамках программы. Все данные
            конфиденциальны.
          </span>
        </label>

        {error && (
          <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={goConfirm}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
        >
          Проверить данные
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    )
  }

  // --- CONFIRM STEP ---
  if (step === "confirm") {
    const filled = allFields.filter((f) => data[f.name].trim())
    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setStep("form")}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Вернуться к редактированию
        </button>

        <h2 className="text-xl font-semibold">Подтвердите данные</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Проверьте правильность введённой информации. После подтверждения заявка
          будет отправлена нашей команде.
        </p>

        <dl className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {filled.map((f) => (
            <div key={f.name} className="grid grid-cols-1 gap-1 bg-secondary/30 px-4 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm text-muted-foreground">{f.label}</dt>
              <dd className="text-sm font-medium text-foreground sm:col-span-2 break-words">
                {data[f.name]}
              </dd>
            </div>
          ))}
        </dl>

        {photo && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-muted-foreground">Фото заявления</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.dataUrl || "/placeholder.svg"}
              alt="Прикреплённое заявление"
              className="max-h-72 w-full rounded-2xl border border-border object-contain bg-secondary/30"
            />
          </div>
        )}

        {error && (
          <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={isLoading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Подтвердить и отправить
            </>
          )}
        </button>
      </div>
    )
  }

  // --- SUCCESS STEP ---
  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-center sm:p-10">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-green-500/10">
        <CheckCircle2 className="size-7 text-green-400" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold">Заявка отправлена</h2>
      <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
        Спасибо, {data.firstName || "ваши данные приняты"}. Мы получили вашу
        заявку и документы. Чтобы отслеживать статус рассмотрения, подтвердите
        ваш номер телефона — вход по номеру, привязанному к Telegram.
      </p>

      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-red-500/30 bg-red-500/5 p-5 text-left">
        <div className="flex items-center gap-2 text-red-500">
          <Phone className="size-5" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">
            Подтверждение номера телефона
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Для отслеживания статуса заявки войдите по номеру{" "}
          <span className="font-medium text-foreground">
            {data.phonePrimary || "вашего телефона"}
          </span>
          .
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
        >
          Подтвердить номер и войти
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <p className="mx-auto mt-6 flex max-w-sm items-start gap-2 text-left text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden="true" />
        Все данные передаются по защищённому каналу и используются только для
        подготовки документов в рамках программы.
      </p>
    </div>
  )
}
