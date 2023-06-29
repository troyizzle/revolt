import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { UpdateEventInput, updateEventSchema } from "~/schema/event";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";
import { toast } from "sonner";

type EventFormProps = {
  event: any
  children: React.ReactNode
}

function EventForm({ event, children }: EventFormProps) {
  const ctx = api.useContext()
  const { mutate } = api.event.update.useMutation({
    onSuccess: () => {
      toast.success('Event updated')
      ctx.event.all.invalidate()
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

export default function AdminPage() {
  const { data: session } = useSession()
  const events = api.event.all.useQuery()

  if (!session) {
    return <div>loading...</div>
  }

  if (!session.user.isAdmin) {
    return <div>Unauthorized</div>
  }

  if (!events.data) {
    return <div>loading...</div>
  }

  return (
    <div className="mx-auto container">
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
            <TableRow>
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
    </div>
  )
}
