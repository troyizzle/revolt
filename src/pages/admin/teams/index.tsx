import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RouterOutputs, api } from "~/utils/api"
import { Player } from "@prisma/client"
import clsx from "clsx"
import { CreateTeamInput, createTeamSchema } from "~/schema/team"
import { Input } from "~/components/UI/Input"
import { Select } from "~/components/UI/Select"
import AdminContainer from "~/components/UI/Admin/Container"
import AdminCard from "~/components/UI/Admin/Card"
import { Button } from "~/components/UI/Button"
import AdminTable from "~/components/UI/Admin/Table"
import AdminFormLayout from "~/components/UI/Admin/FormLayout"

function CreateTeamForm({ setCreatingTeam }: { setCreatingTeam: (creatingTeam: boolean) => void }) {
  const [error, setError] = useState<string | null>(null)
  const players = api.player.getAllWithoutTeam.useQuery()

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema)
  });

  const onSubmit: SubmitHandler<CreateTeamInput> = (data) => mutate(data)

  const { mutate } = api.team.createTeam.useMutation({
    onSuccess: () => {
      setCreatingTeam(false)
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  if (!players.data) {
    return <div>Loading</div>
  }

  function parsePlayersForSelect(players: Player[]) {
    return players.map(player => (
      { label: player.name, value: player.id }
    ))
  }

  return (
    <AdminFormLayout title="Create Team" error={error}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          type="text"
          {...register("name")}
          errorMessage={errors["name"]?.message}
          label="Team Name"
        />
        <Input
          type="number"
          label="Points"
          defaultValue={0}
          {...register("points",
            { valueAsNumber: true }
          )}
          errorMessage={errors["points"]?.message}
        />
        <Select
          multiple={true}
          {...register("players")}
          label='Members' options={parsePlayersForSelect(players.data)} />
        <div className="mt-2 flex flex-row justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCreatingTeam(false)}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx("btn", {
              "btn-disabled": isSubmitting,
              "btn-primary": !isSubmitting
            })}>
            {isSubmitting ? 'Submitting..' : 'Create'}
          </button>
        </div>
      </form>

    </AdminFormLayout>
  )
}

type TeamTableProps = {
  teams: RouterOutputs["team"]["getTeamsWithPlayers"]
}

function TeamTable({ teams }: TeamTableProps) {
  return (
    <AdminTable>
      <AdminTable.Head>
        <AdminTable.HeadRow>
          <AdminTable.HeadCell>Name</AdminTable.HeadCell>
          <AdminTable.HeadCell>Players</AdminTable.HeadCell>
        </AdminTable.HeadRow>
      </AdminTable.Head>
      <AdminTable.Body>
        {teams.map(team => (
          <tr key={team.id}>
            <AdminTable.Cell>{team.name}</AdminTable.Cell>
            <AdminTable.Cell>{team.players.map(player => player.name).join(",")}</AdminTable.Cell>
          </tr>
        ))}
      </AdminTable.Body>
    </AdminTable>
  )
}

function TeamShow() {
  const data = api.team.getTeamsWithPlayers.useQuery()

  return (
    <>
      {data.data ? <TeamTable teams={data.data} /> : <div>Loading..</div>}
    </>
  )
}

type CreateTeamButtonProps = {
  creatingTeam: boolean,
  setCreatingTeam: (creatingTeam: boolean) => void,
}

function CreateTeamButton({ creatingTeam, setCreatingTeam }: CreateTeamButtonProps) {
  const variant = !creatingTeam ? 'primary' : 'secondary'

  return <Button variant={variant} onClick={() => setCreatingTeam(!creatingTeam)}>
    {creatingTeam ? 'Cancel' : 'Add player'}
  </Button>

}

export default function AdminTeamsPage() {
  const [creatingTeam, setCreatingTeam] = useState(false)

  return <AdminContainer>
    <AdminCard>
      <AdminCard.Title title="Teams">
        <CreateTeamButton creatingTeam={creatingTeam} setCreatingTeam={setCreatingTeam} />
      </AdminCard.Title>
    </AdminCard>
    <AdminCard.Body>
      {creatingTeam ? <CreateTeamForm setCreatingTeam={setCreatingTeam} /> :
        <TeamShow />
      }
    </AdminCard.Body>
  </AdminContainer>
}
