import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import AdminContainer from "~/components/UI/Admin/Container"
import AdminFormLayout from "~/components/UI/Admin/FormLayout"
import { Button } from "~/components/UI/Button"
import { Input } from "~/components/UI/Input"
import { UpdateEventSchema, updateEventSchema } from "~/schema/event"
import { RouterOutputs, api } from "~/utils/api"

type FormProps = {
  event: RouterOutputs["event"]["get"]
}

function Form({ event }: FormProps) {
  if (!event) return

  const [error, setError] = useState<string | null>(null)
  const onSubmit: SubmitHandler<UpdateEventSchema> = (data) => mutate({ ...data, id: event.id })

  const { mutate } = api.event.update.useMutation({
    onSuccess: (data) => {
      console.log('success', data)
    },
    onError: (error) => {
      console.log('error', error)
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateEventSchema>({
    defaultValues: {
      scheduledDate: event.scheduledDate || undefined,
      laps: event.laps || undefined,
      track: event.track || undefined,
      date: event.date || undefined,
      serverStatus: event.serverStatus || undefined,
      ip: event.ip || undefined
    },
    resolver: zodResolver(updateEventSchema)
  })


  console.log(errors)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="text-red-500">{error}</div>}
      <Input
        label="Scheduled Date"
        type="date"
        {...register("scheduledDate")}
      />
      <Input
        label="Laps"
        {...register("laps",
          { valueAsNumber: true })
        }
      />
      <Input
        label="Track"
        {...register("track")}
      />
      <Input
        {...register("date",
          { valueAsDate: true }
        )}
        label="Date"
        type="date"
      />
      <Input
        {...register("serverStatus")}
        label="Server Status"
      />
      <Input
        {...register("ip")}
        label="IP"
      />
      <div className="mt-3 flex justify-end">
        <Button variant="primary" type="submit" disabled={isSubmitting}>Update</Button>
      </div>
    </form>
  )
}

export default function EditEventPage() {
  const { id } = useRouter().query
  const { data: session } = useSession()
  const data = api.event.get.useQuery({ id: id as string }, {
    enabled: session?.user?.isAdmin || false && !!id
  })

  if (!session || !session.user?.isAdmin) {
    return <div>Unauthorized</div>
  }

  if (!session.user.isAdmin) {
    return <div>Unauthorized</div>
  }

  if (data.isLoading) {
    return <div>Loading</div>
  }

  if (!data.data) {
    return <div>Event not found</div>
  }

  return (
    <AdminContainer>
      <AdminFormLayout title="Update Event">
        <Form event={data.data} />
      </AdminFormLayout>
    </AdminContainer>
  )
}
