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

export const metadata: Metadata = {
  title: "Handled — Korean local experiences",
  description:
    "Discover authentic Korean local experiences hosted by people you trust.",
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
