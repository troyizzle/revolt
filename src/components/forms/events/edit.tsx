import { zodResolver } from "@hookform/resolvers/zod"
import { type FormEvent } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { type UpdateEventInput, updateEventSchema } from "~/schema/event"
import { api } from "~/utils/api"
import { type Event } from "@prisma/client";

type AdminEditEventFormProps = {
  event: Event
  children: React.ReactNode
}

export default function AdminEditEventForm({
  event,
  children,
}: AdminEditEventFormProps) {
  const ctx = api.useContext()
  const seasons = api.season.getAll.useQuery()

  const { mutate } = api.event.update.useMutation({
    onSuccess: async () => {
      toast.success('Event Update')
      await ctx.event.getAll.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function onSubmit(data: UpdateEventInput) {
    mutate(data)
  }

  const form = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      ...event,
      seasonId: event.seasonId ?? undefined,
    }
  })

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await form.handleSubmit(onSubmit)(event)
  }

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-3" onSubmit={(event) => {
        event.preventDefault()
        void handleFormSubmit(event)
      }}>
        <input type="hidden" {...form.register("id")} />
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
        {children}
      </form>
    </Form>
  )
}
