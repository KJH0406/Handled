import localFont from "next/font/local"
import "./globals.css"
import TopNav from "./components/layout/TopNav"
import FooterSlot from "./components/layout/FooterSlot"
import { BookingProvider } from "./components/booking/BookingProvider"

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

export const metadata = {
  title: "Handled — Korean local experiences",
  description: "Discover authentic Korean local experiences hosted by people you trust.",
}

export default function RootLayout({ children }) {
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
