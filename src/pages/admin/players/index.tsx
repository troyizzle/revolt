import { type GetServerSideProps } from "next";
import { type User, getServerSession } from "next-auth";
import AdminLayout from "~/components/admin-layout";
import DataTable from "~/components/admin/leagues/table/data-table";
import getColumnDef from "~/components/admin/players/table/columns";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

export default function Page() {
  const players = api.player.getAll.useQuery();
  const columns = getColumnDef();

  return (
    <AdminLayout
      title="Players"
      >
      <DataTable data={players.data ?? []} columns={columns} />
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
