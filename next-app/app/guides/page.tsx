import { Suspense } from "react"
import ListScreen from "../screens/ListScreen"

export default function Page() {
  return (
    <Suspense fallback={<main className="fade-in" />}>
      <ListScreen />
    </Suspense>
  )
}
