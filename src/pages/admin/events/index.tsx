import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { type User, getServerSession } from "next-auth"
import AdminLayout from "~/components/admin-layout"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"
import DataTable from "~/components/admin/table/data-table"
import { columns } from "~/components/admin/events/table/columns"
import AdminNewEventForm from "~/components/forms/events/new"

export default function AdminPage({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const events = api.event.getAll.useQuery()


  return (
    <AdminLayout
      title="Events"
      createForm={<AdminNewEventForm />}
    >
      <DataTable columns={columns} data={events.data ?? []} />
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{ user: User }> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || !session.user.isAdmin) {
    return {
      redirect: {
        destination: '/?errorMessage=You are not an admin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user
    },
  }
}
