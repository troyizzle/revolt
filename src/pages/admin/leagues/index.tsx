import { zodResolver } from "@hookform/resolvers/zod"
import { type GetServerSideProps } from "next"
import { type User, getServerSession } from "next-auth"
import { useState } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import AdminLayout from "~/components/admin-layout"
import { columns } from "~/components/admin/leagues/table/columns"
import DataTable from "~/components/admin/leagues/table/data-table"
import AdminNewModal from "~/components/admin/modal/new"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { type CreateLeagueSchema, createLeagueSchema } from "~/schema/league"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"

type LeagueFormProps = {
  form: UseFormReturn<CreateLeagueSchema>
}

function LeagueForm({ form }: LeagueFormProps) {
  const [open, setIsOpen] = useState(false)
  const ctx = api.useContext()

  const { mutate } = api.league.create.useMutation({
    onSuccess: async () => {
      toast.success('League created')
      await ctx.league.getAll.invalidate()
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  function onSubmit(data: CreateLeagueSchema) {
    mutate(data)
  }

  return (
    <AdminNewModal
      form={form}
      onSubmit={onSubmit}
      modalTitle="Create a new League"
      modalDescription="This will create a new league."
      open={open}
      setIsOpen={setIsOpen}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>League</FormLabel>
            <FormControl>
              <Input placeholder="name" type="text" {...field} />
            </FormControl>
            <FormDescription>
              This is the name of the League.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </AdminNewModal>
  )
}

export default function AdminLeaguesPage() {
  const league = api.league.getAll.useQuery()

  const form = useForm<CreateLeagueSchema>({
    resolver: zodResolver(createLeagueSchema)
  })

  return (
    <AdminLayout
      title="Leagues"
      createForm={<LeagueForm form={form} />}
    >
      <DataTable data={league.data ?? []} columns={columns} />
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
