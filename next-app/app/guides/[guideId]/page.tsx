import ProfileScreen from "../../screens/ProfileScreen"

interface PageProps {
  params: { guideId: string }
}

export default function Page({ params }: PageProps) {
  return <ProfileScreen guideId={params.guideId} />
}
