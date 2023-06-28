import { useSession } from "next-auth/react";
import AdminContainer from "~/components/UI/Admin/Container";

export default function AdminPage() {
  const { data: session } = useSession()

  if (!session) {
    return <div>loading...</div>
  }

  if (!session.user.isAdmin) {
    return <div>Unauthorized</div>
  }

  return (
    <>
      <AdminContainer>
        <div>Admin</div>
      </AdminContainer>
    </>
  )
}
