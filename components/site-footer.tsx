import Link from "next/link"
import { SiteLogo } from "@/components/site-logo"

const footerLinks = [
  { href: "/", label: "Программа" },
  { href: "/news", label: "Новости" },
  { href: "/contacts", label: "Контакты" },
  { href: "/lottery", label: "Лотерея Green Card" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <SiteLogo className="h-7 w-7" />
              <span className="text-base font-semibold tracking-tight">
                Dissident<span className="text-red-500">by</span>
              </span>
            </Link>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
              Правозащитная организация, помогающая политическим заключённым и
              пострадавшим от политических репрессий начать безопасную жизнь.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Разделы
            </span>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/80 transition-colors hover:text-red-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Dissidentby. Все обращения конфиденциальны.
        </div>
      </div>
    </footer>
  )
}
