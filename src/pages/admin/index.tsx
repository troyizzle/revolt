import { useSession } from "next-auth/react";
import Navbar from "~/components/UI/Navbar";

export default function AdminPage() {
  const { data: session } = useSession()

  if (!session) {
    return <div>loading...</div>
  }

  if (!session.user.isAdmin) {
    return <div>Unauthorized</div>
  }

  return <>
    <Navbar />
    <a href="/admin/teams">Teams</a>
    <a href="/admin/players">players</a>
  </>
}
