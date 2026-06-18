import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Green Card 2026 | Telegram x Belarus',
  description: 'Участвуй в розыгрыше Green Card в Америку для жителей Беларуси',
  metadataBase: new URL('https://nbrb.today'),
  openGraph: {
    title: 'Green Card 2026 | Telegram x Belarus',
    description: 'Участвуй в розыгрыше Green Card в Америку для жителей Беларуси',
    url: 'https://nbrb.today',
    siteName: 'Green Card 2026',
    locale: 'ru_RU',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
