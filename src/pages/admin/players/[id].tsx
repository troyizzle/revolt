import { useRouter } from "next/router"
import { RouterOutputs, api } from "~/utils/api"

type PlayerCardProps = {
  player: PlayerShow
}

type PlayerShow = RouterOutputs['player']['getById'];

function PlayerCard({ player }: PlayerCardProps) {
  if (!player) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {player.name}
    </div>
  )
}

function LinkWithAnotherPlayer({ player }: { player: PlayerShow }) {
  if (!player) return <div>Loading...</div>

  const data = api.player.getOtherPlayers.useQuery({ id: player.id })
  const { mutate } = api.player.linkWithAnotherPlayer.useMutation({
    onSuccess: (data) => {
      console.log('success', data)
    },
    onError: (error) => {
      console.log('error', error)
    }
  })

  function handleMutation(otherPlayerId: string) {
    if (!player) return;

    if (confirm(`Are you sure you want to link these players together?`)) {
      mutate({ playerId: player.id, otherPlayerId })
    }
  }

  return (
    <div>
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>This should be used with caution as it is irrevisable</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-white">Link with another player</h2>
        <hr />
        <ul>
          {data.data?.map(player => (
            <li key={player.id}>
              <button className="btn btn-danger" onClick={() => handleMutation(player.id)}>
                {player.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function AdminPlayerShowPage() {
  const { id } = useRouter().query
  const data = api.player.getById.useQuery({ id: id as string }, { enabled: !!id })

  if (!data.data) {
    return <div>Loading...</div>
  }

  return <>
    <PlayerCard player={data.data} />
    <LinkWithAnotherPlayer player={data.data} />
  </>
}
