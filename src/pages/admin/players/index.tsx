import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import AdminCard from "~/components/UI/Admin/Card";
import Layout from "~/components/UI/Layout";
import { CreatePlayerInput, createPlayerSchema } from "~/schema/player";
import { RouterOutputs, api } from "~/utils/api";
import { Input } from "~/components/UI/Input"
import clsx from "clsx";
import { useState } from "react";
import Avatar from "~/components/UI/Avatar";
import { Button } from "~/components/UI/Button";
import Link from "next/link";

type PlayerFormProps = {
  setShowForm: (show: boolean) => void
  refetch: () => void
}

function PlayerForm({ setShowForm, refetch }: PlayerFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreatePlayerInput>({
    resolver: zodResolver(createPlayerSchema)
  });

  const { mutate } = api.player.create.useMutation({
    onSuccess: (data) => {
      setShowForm(false)
      refetch()
      console.log('success', data)
    },
    onError: (error) => {
      setServerError(error.message)
    }
  })

  const onSubmit: SubmitHandler<CreatePlayerInput> = (data) => {
    mutate(data)
  }

  return (
    <div className="m-2">
      <h2 className="card-title">Add Player</h2>
      {serverError && <div className="alert alert-error">{serverError}</div>}
      <div className="divider"></div>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("name")}
          type="text"
          label="Name"
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

type PlayerTableProps = {
  players: PlayerWithUser
}

function PlayerTable({ players }: PlayerTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.name}>
              <td>
                <div className="flex items-center space-x-3">
                  <Avatar src={player.user?.image} />
                  <div className="font-semibold">
                  <a href={`/admin/players/${player.id}`}>
                  {player.name}</a>
                  </div>
                  <div className="text-sm opacity-50">
                    {player.user?.name}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type CreatePlayerButtonProps = {
  showForm: boolean
  setShowForm: (value: boolean) => void
}

function CreatePlayerButton({ showForm, setShowForm }: CreatePlayerButtonProps) {
  const variant = !showForm ? 'primary' : 'secondary'

  return <Button variant={variant} onClick={() => setShowForm(!showForm)}>
    {showForm ? 'Cancel' : 'Add player'}
  </Button>
}

type PlayerWithUser = RouterOutputs['player']['getAll'];

export default function AdminPlayerPage() {
  const [showForm, setShowForm] = useState(false)
  const data = api.player.getAll.useQuery()

  return (
    <>
      <Layout>
        <AdminCard>
          <AdminCard.Title title="Players">
            <CreatePlayerButton showForm={showForm} setShowForm={setShowForm} />
          </AdminCard.Title>
          <AdminCard.Body>
            {showForm ? <PlayerForm setShowForm={setShowForm} refetch={data.refetch} /> :
              (data.data && <PlayerTable players={data.data} />)
            }
          </AdminCard.Body>
        </AdminCard>
      </Layout>
    </>
  )
}
