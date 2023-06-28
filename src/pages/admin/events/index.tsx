import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react";
import AdminCard from "~/components/UI/Admin/Card";
import AdminContainer from "~/components/UI/Admin/Container";
import AdminTable from "~/components/UI/Admin/Table";
import { Button } from "~/components/UI/Button";
import { RouterOutputs, api } from "~/utils/api";
import { Input } from "~/components/UI/Input";
import { ScheduleEventSchema } from "~/schema/event";
import { scheduleEventSchema } from "~/schema/event";

type EventTableProps = {
  events: RouterOutputs["event"]["all"]
}

type EventFormProps = {
  setShowForm: (show: boolean) => void
  refetch: () => void
}

function EventForm({ setShowForm, refetch }: EventFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ScheduleEventSchema>({
    resolver: zodResolver(scheduleEventSchema)
  });

  const { mutate } = api.event.schedule.useMutation({
    onSuccess: (data) => {
      setShowForm(false)
      refetch()
      console.log('success', data)
    },
    onError: (error) => {
      setServerError(error.message)
    }
  })

  const onSubmit: SubmitHandler<ScheduleEventSchema> = (data) => {
    mutate(data)
  }

  return (
    <div className="m-2">
      <h2 className="card-title">Schedule a new event</h2>
      {serverError && <div className="alert alert-error">{serverError}</div>}
      {errors && errors.scheduledDate && <div className="alert alert-error">{errors.scheduledDate.message}</div>}
      <div className="divider"></div>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("scheduledDate",
            { valueAsDate: false }
          )}
          type="date"
          label="Scheduled Date"
        />
        <div className="mt-2 flex flex-row justify-end">
          <button
            type="submit"
            className={clsx("btn", {
              "btn-disabled": isSubmitting,
              "btn-primary": !isSubmitting,
            })}>Submit</button>
        </div>
      </form>
    </div>
  )
}


function EventTable({ events }: EventTableProps) {
  return (
    <AdminTable>
      <AdminTable.Head>
        <AdminTable.HeadCell>Date</AdminTable.HeadCell>
        <AdminTable.HeadCell>Track</AdminTable.HeadCell>
        <AdminTable.HeadCell>Laps</AdminTable.HeadCell>
        <AdminTable.HeadCell>IP</AdminTable.HeadCell>
        <AdminTable.HeadCell>Server Status</AdminTable.HeadCell>
        <AdminTable.HeadCell>Results</AdminTable.HeadCell>
        <AdminTable.HeadCell>Actions</AdminTable.HeadCell>
      </AdminTable.Head>
      <AdminTable.Body>
        {events.map(event => (
          <tr key={event.id}>
            <AdminTable.Cell>
              {event.serverStatus == "CREATED" ? event.scheduledDate?.toString() : event.date?.toString()}
            </AdminTable.Cell>
            <AdminTable.Cell>{event.track}</AdminTable.Cell>
            <AdminTable.Cell>{event.laps}</AdminTable.Cell>
            <AdminTable.Cell>{event.ip}</AdminTable.Cell>
            <AdminTable.Cell>{event.serverStatus}</AdminTable.Cell>
            <AdminTable.Cell>
              <a href={event.resultsUrl}>results</a>
            </AdminTable.Cell>
            <AdminTable.Cell>
              <a className="btn btn-secondary" href={`/admin/events/${event.id}/edit`}>Edit</a>
              <Button variant="danger">Delete</Button>
            </AdminTable.Cell>
          </tr>
        ))}
      </AdminTable.Body>
    </AdminTable>
  )
}

type CreateEventButtonProps = {
  showForm: boolean
  setShowForm: (value: boolean) => void
}

function CreateEventButton({ showForm, setShowForm }: CreateEventButtonProps) {
  const variant = !showForm ? 'primary' : 'secondary'

  return <Button variant={variant} onClick={() => setShowForm(!showForm)}>
    {showForm ? 'Cancel' : 'Schedule Event'}
  </Button>
}


export default function EventPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: session } = useSession()
  const data = api.event.all.useQuery(undefined, {
    enabled: session?.user?.isAdmin || false
  })

  if (!session) return null

  if (!session.user.isAdmin) {
    return <div>Unauthorized</div>
  }

  if (!data.data) {
    return <div>Loading...</div>
  }

  return (
    <AdminContainer>
      <AdminCard.Title title="Events">
        <CreateEventButton showForm={showForm} setShowForm={setShowForm} />
      </AdminCard.Title>
      <AdminCard.Body>
        {showForm ? <EventForm setShowForm={setShowForm} refetch={data.refetch} /> : <EventTable events={data.data} />}
      </AdminCard.Body>
    </AdminContainer>
  )
}
