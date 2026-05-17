import type { Metadata } from "next"
import localFont from "next/font/local"
import type { ReactNode } from "react"
import { BookingProvider } from "./components/booking/BookingProvider"
import FooterSlot from "./components/layout/FooterSlot"
import TopNav from "./components/layout/TopNav"
import "./globals.css"

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
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
    default: `${SITE_NAME} — Korean local experiences`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME} — Korean local experiences`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Korean local experiences`,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={pretendard.variable}>
      <body>
        <div id="root">
          <BookingProvider>
            <TopNav />
            {children}
            <FooterSlot />
          </BookingProvider>
        </div>
      </body>
    </html>
  )
}
