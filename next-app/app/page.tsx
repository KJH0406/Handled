import type { Metadata } from "next"
import HomeScreen from "./screens/HomeScreen"

export const metadata: Metadata = {
  title: {
    absolute: "Handled — Korean local experiences",
  },
  description:
    "Discover authentic Korean local experiences hosted by people you trust.",
  alternates: { canonical: "/" },
}

export default function Page() {
  return <HomeScreen />
}
