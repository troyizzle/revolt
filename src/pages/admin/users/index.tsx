import AdminLayout from "~/components/admin-layout";
import { api } from "~/utils/api";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

export default function AdminMembersIndexPage() {
  const users = api.user.getAll.useQuery()

  return (
    <AdminLayout>
      <DataTable columns={columns} data={users.data ?? []} />
    </AdminLayout>
  )
}
