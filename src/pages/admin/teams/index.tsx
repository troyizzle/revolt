import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "~/utils/api"
import Layout from "~/components/UI/Layout"
import { Player, Team } from "@prisma/client"
import clsx from "clsx"
import { CreateTeamInput, createTeamSchema } from "~/schema/team"
import { Input } from "~/components/UI/Input"
import { Select } from "~/components/UI/Select"

function CreateTeamButton({ setCreatingTeam }: { setCreatingTeam: (creatingTeam: boolean) => void }) {
  return <button className="btn btn-primary" onClick={() => setCreatingTeam(true)}>
    Create Team
  </button>
}

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

  console.log(errors)

  if (!players.data) {
    return <div>Loading</div>
  }

  function parsePlayersForSelect(players: Player[]) {
    return players.map(player => (
      { label: player.name, value: player.id }
    ))
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-bold text-white">Create Team</h2>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {error &&
          <div className="alert alert-error">
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 4v16m8-8H4" />
              </svg>
              <label>{error}</label>
            </div>
          </div>
        }
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
    </div>
  )
}

type TeamTableProps = {
  teams: Team[] // Change this to router output
}

function TeamTable({ teams }: TeamTableProps) {
  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Name</th>
        </tr>
      </thead>
      <tbody>
        {teams.map(team => (
          <tr key={team.id}>
            <td className="px-4 py-2">{team.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TeamHeader({ setCreatingTeam }: { creatingTeam: boolean, setCreatingTeam: (creatingTeam: boolean) => void }) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>Current Teams</div>
      <div>
        <CreateTeamButton setCreatingTeam={setCreatingTeam} />
      </div>
    </div>
  )
}

type TeamShowProps = {
  creatingTeam: boolean,
  setCreatingTeam: (creatingTeam: boolean) => void,
}

function TeamShow({ creatingTeam, setCreatingTeam }: TeamShowProps) {
  const data = api.team.getTeams.useQuery()

  return (
    <>
      <TeamHeader creatingTeam={creatingTeam} setCreatingTeam={setCreatingTeam} />
      {data.data ? <TeamTable teams={data.data} /> : <div>Loading..</div>}
    </>
  )
}

export default function AdminTeamsPage() {
  const [creatingTeam, setCreatingTeam] = useState(false)

  return <Layout>
    <div className="bg-slate-700 rounded-md px-3 py-2">
      {creatingTeam ? <CreateTeamForm setCreatingTeam={setCreatingTeam} /> :
        <TeamShow creatingTeam={creatingTeam} setCreatingTeam={setCreatingTeam} />
      }
    </div>
  </Layout>
}
