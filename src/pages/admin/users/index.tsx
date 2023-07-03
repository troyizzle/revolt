import { type GetServerSideProps } from "next";
import { type User, getServerSession } from "next-auth";
import AdminLayout from "~/components/admin-layout";
import { columns } from "~/components/admin/users/table/columns";
import DataTable from "~/components/admin/users/table/data-table";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

export default function AdminMembersIndexPage() {
  const users = api.user.getAll.useQuery()

  return (
    <AdminLayout
      title="Users"
    >
      <DataTable columns={columns} data={users.data ?? []} />
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
