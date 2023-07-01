import { zodResolver } from "@hookform/resolvers/zod"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { type User, getServerSession } from "next-auth"
import Link from "next/link"
import { type FormEvent } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import AdminLayout from "~/components/admin-layout"
import { Icons } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { type UpdateEventInput, updateEventSchema } from "~/schema/event"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"
import { type Event } from "@prisma/client"

type EventFormProps = {
  event: Event
  children: React.ReactNode
}

function EventForm({ event, children }: EventFormProps) {
  const ctx = api.useContext()
  const { mutate } = api.event.update.useMutation({
    onSuccess: async () => {
      toast.success('Event updated')
      await ctx.event.all.invalidate()
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const form = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      ...event
    }
  })

  function onSubmit(data: UpdateEventInput) {
    mutate(data)
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await form.handleSubmit(onSubmit)(event);
  };

  return (
    <Form {...form}>
      <form onSubmit={(event) => {
        event.preventDefault();
        void handleFormSubmit(event);
      }}>
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
        {children}
      </form>
    </Form>
  )
}

export default function AdminPage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const events = api.event.all.useQuery()

  if (!events.data) {
    return <div>loading...</div>
  }

  return (
    <AdminLayout>
      <Table>
        <TableCaption>All events</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Short Name</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.data.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.shortName}</TableCell>
              <TableCell>{event.order}</TableCell>
              <TableCell className="flex items-center space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <Icons.edit />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit event</DialogTitle>
                      <DialogDescription>
                        Make changes to the event.
                      </DialogDescription>
                    </DialogHeader>
                    <EventForm event={event}>
                      <DialogFooter>
                        <DialogTrigger asChild>
                          <Button type="submit" variant="default">Submit</Button>
                        </DialogTrigger>
                      </DialogFooter>
                    </EventForm>
                  </DialogContent>
                </Dialog>
                <Link href={`/admin/events/${event.id}/races`}>
                  <Icons.car />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
