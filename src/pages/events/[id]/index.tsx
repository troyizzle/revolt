import { useRouter } from "next/router"
import { Header } from "~/components/header"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { api } from "~/utils/api"

export default function EventShowPage() {
  const router = useRouter()
  const eventId = router.query.id as string
  const event = api.event.get.useQuery({ id: eventId })

  return <div className="container mx-auto">
    {!event.data ? (
      <div>Loading</div>
    ) : (
      <>
        <Header
          className="my-8 text-center"
          title={`${event.data.name} Endurance: ${event.data.Race[0]?.laps ?? 0} laps`}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Race Time</TableHead>
              <TableHead>Gap</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Best Lap</TableHead>
              <TableHead>Average Lap</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {event.data?.Race[0]?.PlayerRace?.map((playerRace) => (
              <TableRow key={playerRace.id}>
                <TableHead>{playerRace.position}</TableHead>
                <TableHead>{playerRace.player.name}</TableHead>
                <TableHead>{playerRace.time}</TableHead>
                <TableHead>{playerRace.gap ?? "-"}</TableHead>
                <TableHead>{playerRace.interval ?? "-"}</TableHead>
                <TableHead>{playerRace.bestLap}</TableHead>
                <TableHead>{playerRace.averageLap}</TableHead>
                <TableHead>{playerRace.car}</TableHead>
                <TableHead>{playerRace.points}</TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    )}
  </div>
}
