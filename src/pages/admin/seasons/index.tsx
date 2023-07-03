import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { type GetServerSideProps } from "next"
import { type User, getServerSession } from "next-auth"
import { useState } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import AdminLayout from "~/components/admin-layout"
import AdminNewModal from "~/components/admin/modal/new"
import { columns } from "~/components/admin/seasons/table/columns"
import DataTable from "~/components/admin/table/data-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { type CreateSeasonSchema, createSeasonSchema } from "~/schema/season"
import { authOptions } from "~/server/auth"
import { type RouterOutputs, api } from "~/utils/api"

type SeasonFormProps = {
  form: UseFormReturn<CreateSeasonSchema>
}

function SeasonForm({ form }: SeasonFormProps) {
  const [open, setIsOpen] = useState(false)
  const ctx = api.useContext()
  const league = api.league.getAll.useQuery()

  const { mutate } = api.season.create.useMutation({
    onSuccess: async () => {
      toast.success('Season created')
      await ctx.season.getAll.invalidate()
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  function onSubmit(data: CreateSeasonSchema) {
    mutate(data)
  }

  return (
    <AdminNewModal
      form={form}
      onSubmit={onSubmit}
      modalTitle="Create Season"
      modalDescription="Create a new season."
      open={open}
      setIsOpen={setIsOpen}
    >
      <FormField
        control={form.control}
        name="leagueId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>League</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a league to associate this season with" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {league.data?.map((league) => (
                  <SelectItem key={league.id} value={league.id}>
                    {league.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              This is the league it belongs too.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="name" type="text" {...field} />
            </FormControl>
            <FormDescription>
              This will be the display name for the season
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              {...field}
              value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
              onChange={(event) => {
                field.onChange(new Date(event.target.value))
              }}
            />
            <FormDescription>
              This season start date.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              {...field}
              value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
              onChange={(event) => {
                field.onChange(new Date(event.target.value))
              }}
            />
            <FormDescription>
              This is the season End Date, this can be set later if unknown.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

    </AdminNewModal>
  )
}

export type SeasonWithLeague = RouterOutputs["season"]["getAll"]

export default function AdminSeasonsPage() {
  const seasons = api.season.getAll.useQuery()

  const form = useForm<CreateSeasonSchema>({
    resolver: zodResolver(createSeasonSchema)
  })

  return (
    <AdminLayout
      title="Seasons"
      createForm={<SeasonForm form={form} />}
    >
      <DataTable columns={columns} data={seasons.data ?? []} />
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
