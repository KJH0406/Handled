import { Suspense } from "react"
import ExperiencesScreen from "../screens/ExperiencesScreen"

export default function Page() {
  return (
    <Suspense fallback={<main className="fade-in" />}>
      <ExperiencesScreen />
    </Suspense>
  )
}
