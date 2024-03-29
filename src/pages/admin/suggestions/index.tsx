import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { type User, getServerSession } from "next-auth"
import AdminLayout from "~/components/admin-layout"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"
import DataTable from "~/components/admin/table/data-table"
import { columns } from "~/components/admin/suggestions/table/columns"

export default function AdminPage({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const suggestions = api.suggestion.getAll.useQuery()

  return (
    <AdminLayout
      title="Suggestions"
    >
      <DataTable columns={columns} data={suggestions.data ?? []} />
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
