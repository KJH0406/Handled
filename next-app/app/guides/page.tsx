import type { Metadata } from "next"
import { Suspense } from "react"
import ListScreen from "../screens/ListScreen"

export const metadata: Metadata = {
  title: "Find a local guide",
  description:
    "Match with vetted local guides across Korea by the hour. From $40 / hour.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Find a local guide — Handled",
    description:
      "Match with vetted local guides across Korea by the hour. From $40 / hour.",
    url: "/guides",
  },
}

export default function Page() {
  return (
    <Suspense fallback={<main className="fade-in" />}>
      <ListScreen />
    </Suspense>
  )
}
