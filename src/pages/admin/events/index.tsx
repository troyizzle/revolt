import { zodResolver } from "@hookform/resolvers/zod"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { type User, getServerSession } from "next-auth"
import { type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import AdminLayout from "~/components/admin-layout"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { type CreateEventInput, createEventSchema } from "~/schema/event"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"
import DataTable from "~/components/admin/table/data-table"
import { columns } from "~/components/admin/events/table/columns"
import AdminNewModal from "~/components/admin/modal/new"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { useState } from "react"

type EventFormProps = {
  form: UseFormReturn<CreateEventInput>
}

function EventForm({ form }: EventFormProps) {
  const [open, setIsOpen] = useState(false)
  const ctx = api.useContext()
  const seasons = api.season.getAll.useQuery()

  const { mutate } = api.event.create.useMutation({
    onSuccess: async () => {
      toast.success('Event created')
      await ctx.event.getAll.invalidate()
      setIsOpen(false)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  function onSubmit(data: CreateEventInput) {
    mutate(data)
  }

  return (
    <AdminNewModal
      form={form}
      onSubmit={onSubmit}
      modalTitle="Create Event"
      modalDescription="Create a new event"
      open={open}
      setIsOpen={setIsOpen}
    >
      <FormField
        control={form.control}
        name="seasonId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Season</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a league to associate this season with" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {seasons.data?.map((league) => (
                  <SelectItem key={league.id} value={league.id}>
                    {league.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The league this season is associated with.
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
              <Input placeholder="name" {...field} />
            </FormControl>
            <FormDescription>
              The name of the event
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shortName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Name</FormLabel>
            <FormControl>
              <Input placeholder="short name" {...field} />
            </FormControl>
            <FormDescription>
              This shortname will be used in the table results.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order</FormLabel>
            <FormControl>
              <Input
              type="number"
              placeholder="order" {...field}
              onChange={(e) => {
                field.onChange(parseInt(e.target.value))
              }}
              />
            </FormControl>
            <FormDescription>
              The order of the event in the season.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

    </AdminNewModal>
  )
}

export default function AdminPage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const events = api.event.getAll.useQuery()

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema)
  })

  return (
    <AdminLayout
      title="Events"
      createForm={<EventForm form={form} />}
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