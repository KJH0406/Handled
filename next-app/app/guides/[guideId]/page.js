import ProfileScreen from "../../screens/ProfileScreen"

export default function Page({ params }) {
  return <ProfileScreen guideId={params.guideId} />
}
