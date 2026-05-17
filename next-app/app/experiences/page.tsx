import type { Metadata } from "next"
import { Suspense } from "react"
import ExperiencesScreen from "../screens/ExperiencesScreen"

export const metadata: Metadata = {
  title: "All Korean experiences",
  description:
    "Pick from curated experience packages hosted by local guides across Korea.",
  alternates: { canonical: "/experiences" },
  openGraph: {
    title: "All Korean experiences — Handled",
    description:
      "Pick from curated experience packages hosted by local guides across Korea.",
    url: "/experiences",
  },
}

export default function Page() {
  return (
    <Suspense fallback={<main className="fade-in" />}>
      <ExperiencesScreen />
    </Suspense>
  )
}
