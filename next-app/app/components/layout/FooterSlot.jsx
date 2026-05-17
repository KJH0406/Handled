"use client"

import { usePathname } from "next/navigation"
import Footer from "./Footer"

export default function FooterSlot() {
  const pathname = usePathname()
  if (pathname === "/checkout/confirmed") return null
  return <Footer />
}
