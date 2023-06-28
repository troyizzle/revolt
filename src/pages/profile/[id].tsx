import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { RouterOutputs, api } from "~/utils/api"

type ShowProfile = RouterOutputs["profile"]["getProfile"]

// TODO: How to not use null no this
type DisplayProfileProps = {
  profile: ShowProfile
}

function DisplayProfile({ profile }: DisplayProfileProps) {
  if (!profile) return <div>Loading...</div>

  return (
    <div>
      <div className="flex flex-row">
      </div>
    </div>
  )
}

export default function Profile() {
  const { id } = useRouter().query
  if (!id) return <div>Loading...</div>

  const { data: session } = useSession()

  const userIdQuery = id == '@me' ? session?.user?.id : id

  const data = api.profile.getProfile.useQuery({ userId: userIdQuery as string })

  const { data: profile } = data

  if (!profile) return <div>Loading...</div>

  return (
    <div>{profile.userId}</div>
  )
}
