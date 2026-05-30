import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import localFont from "next/font/local"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import ogImage from "@/img/thumbnail.png"
import { routing } from "../../i18n/routing"
import { AuthProvider } from "../components/auth/AuthProvider"
import { BookingProvider } from "../components/booking/BookingProvider"
import FooterSlot from "../components/layout/FooterSlot"
import TopNav from "../components/layout/TopNav"
import "../globals.css"

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
const SITE_NAME = "Handled"
const SITE_DESCRIPTION =
  "Discover authentic Korean local experiences hosted by people you trust."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Korean local experiences`,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME} - Korean local experiences`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Korean local experiences`,
    description: SITE_DESCRIPTION,
    images: [ogImage.src],
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: ReactNode
  params: { locale: string }
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale} className={pretendard.variable}>
      <body>
        <div id="root">
          <NextIntlClientProvider>
            <AuthProvider>
              <BookingProvider>
                <TopNav />
                {children}
                <FooterSlot />
              </BookingProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  )
}
