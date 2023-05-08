import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { api } from "~/utils/api"

export default function Profile() {
  const { id } = useRouter().query
  if (!id) return <div>Loading...</div>

  const { data: session } = useSession()
  const userId = id == '@me' ? session?.user?.id : id

  const data = api.profile.getProfile.useQuery({ userId: userId as string },
    { enabled: !!userId })

  const { data: profile } = data

  if (!profile) return <div>Loading...</div>

  return (
    <div>Hello</div>
  )
}
