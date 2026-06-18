import type { Metadata } from "next"
import { LogIn, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { PhoneAuth } from "@/components/phone-auth"

export const metadata: Metadata = {
  title: "Вход | Dissidentby",
  description:
    "Войдите по номеру телефона, чтобы отслеживать статус вашей заявки на участие в программе.",
}

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-background text-foreground">
        <PageHero
          compact
          eyebrow={
            <>
              <LogIn className="size-3.5" aria-hidden="true" />
              Вход
            </>
          }
          title="Отслеживание заявки"
          description="Авторизуйтесь по номеру телефона, привязанному к Telegram, чтобы проверить статус вашей заявки на программу. Вход занимает меньше минуты."
        />

        <div className="mx-auto w-full max-w-md px-5 pb-20">
          <PhoneAuth />

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-red-500" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Мы не храним и не передаём ваш пароль третьим лицам. Авторизация
              нужна только для подтверждения личности и безопасного доступа к
              статусу заявки.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
