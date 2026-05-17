"use client"

import { useState } from "react"
import TopNav from "./components/layout/TopNav"
import Footer from "./components/layout/Footer"
import HomeScreen from "./screens/HomeScreen"
import ListScreen from "./screens/ListScreen"
import ExperiencesScreen from "./screens/ExperiencesScreen"
import ProfileScreen from "./screens/ProfileScreen"
import ExperienceDetailScreen from "./screens/ExperienceDetailScreen"
import PaymentScreen from "./screens/PaymentScreen"
import ConfirmScreen from "./screens/ConfirmScreen"

const renderScreen = (route, navigate, booking, onReserve, onConfirm) => {
  switch (route.name) {
    case "home":
      return <HomeScreen navigate={navigate} />
    case "list":
      return (
        <ListScreen
          navigate={navigate}
          initialCity={route.initialCity}
          initialQuery={route.initialQuery}
        />
      )
    case "experiences":
      return (
        <ExperiencesScreen
          navigate={navigate}
          initialCity={route.initialCity}
          initialCategory={route.initialCategory}
          initialQuery={route.initialQuery}
        />
      )
    case "profile":
      return (
        <ProfileScreen
          navigate={navigate}
          guideId={route.guideId}
          onReserve={onReserve}
        />
      )
    case "experience":
      return (
        <ExperienceDetailScreen
          navigate={navigate}
          expId={route.expId}
          onReserve={onReserve}
        />
      )
    case "payment":
      return (
        <PaymentScreen
          navigate={navigate}
          booking={booking}
          onConfirm={onConfirm}
        />
      )
    case "confirm":
      return <ConfirmScreen navigate={navigate} booking={booking} />
    default:
      return null
  }
}

export default function HandledApp() {
  const [route, setRoute] = useState({ name: "home" })
  const [booking, setBooking] = useState(null)

  const navigate = (name, params = {}) => {
    setRoute({ name, ...params })
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  const onReserve = (b) => {
    setBooking({ ...b })
    navigate("payment")
  }

  const onConfirm = (b) => {
    setBooking({ ...b })
    navigate("confirm")
  }

  return (
    <>
      <TopNav navigate={navigate} route={route} />
      {renderScreen(route, navigate, booking, onReserve, onConfirm)}
      {route.name !== "confirm" && <Footer />}
    </>
  )
}
