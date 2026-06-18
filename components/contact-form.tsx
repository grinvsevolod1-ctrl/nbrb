"use client"

import { useState, type FormEvent } from "react"
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setError("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get("name") ?? ""),
      contact: String(formData.get("contact") ?? ""),
      message: String(formData.get("message") ?? ""),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Не удалось отправить сообщение.")
      }
      setStatus("success")
      form.reset()
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Что-то пошло не так.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/30 bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
          <CheckCircle2 className="size-6 text-red-500" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold">Сообщение отправлено</h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Мы получили ваше обращение и ответим в течение 3–4 дней. Все обращения конфиденциальны.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-medium text-red-400 transition-colors hover:text-red-300"
        >
          Отправить ещё одно
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className={compact ? "flex flex-col gap-4 sm:flex-row" : "grid gap-4 sm:grid-cols-2"}>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="cf-name" className="text-sm font-medium text-foreground/90">
            Ваше имя
          </label>
          <input
            id="cf-name"
            name="name"
            required
            maxLength={200}
            placeholder="Как к вам обращаться"
            className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="cf-contact" className="text-sm font-medium text-foreground/90">
            Telegram, email или телефон
          </label>
          <input
            id="cf-contact"
            name="contact"
            required
            maxLength={200}
            placeholder="@username или email"
            className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      {!compact && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-message" className="text-sm font-medium text-foreground/90">
            Сообщение
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Коротко опишите ваш запрос, чтобы мы ответили точнее"
            className="resize-y rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Отправляем…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Отправить сообщение
          </>
        )}
      </button>
      <p className="text-xs text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь, что мы свяжемся с вами. Все обращения конфиденциальны.
      </p>
    </form>
  )
}
