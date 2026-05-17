import ExperienceDetailScreen from "../../screens/ExperienceDetailScreen"

interface PageProps {
  params: { expId: string }
}

export default function Page({ params }: PageProps) {
  return <ExperienceDetailScreen expId={params.expId} />
}
