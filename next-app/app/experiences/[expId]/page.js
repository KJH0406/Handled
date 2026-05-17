import ExperienceDetailScreen from "../../screens/ExperienceDetailScreen"

export default function Page({ params }) {
  return <ExperienceDetailScreen expId={params.expId} />
}
