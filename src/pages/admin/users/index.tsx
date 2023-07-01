import AdminLayout from "~/components/admin-layout";
import { columns } from "~/components/admin/users/table/columns";
import DataTable from "~/components/admin/users/table/data-table";
import { api } from "~/utils/api";

export default function AdminMembersIndexPage() {
  const users = api.user.getAll.useQuery()

  return (
    <AdminLayout>
      <DataTable columns={columns} data={users.data ?? []} />
    </AdminLayout>
  )
}
