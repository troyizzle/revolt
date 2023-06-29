import { Header } from "~/components/header";
import { Icons } from "~/components/icons";
import { Shell } from "~/components/shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import {  api } from "~/utils/api";

export default function LeaderboardPage() {
  const raceData = api.event.allWithRaceData.useQuery()
  const { data } = raceData

  return (
    <Shell>
      <Header
        className="mb-8 text-center"
        title="Leaderboard"
        description="See how you stack up against the competition"
      />
      {!data ? (
        <div className="flex justify-center">
          <Icons.spinner className="animate-spin h-8 w-8 text-blue-800" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pos</TableHead>
                <TableHead>Player</TableHead>
                {data.eventNames.map((eventName, index) => (
                  <TableHead key={index}>{eventName}</TableHead>
                ))}
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.players.map((data, index) => (
                <TableRow key={data.player}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.player}</TableCell>
                  {data.points.map((points, index) => (
                    <TableCell key={index}>{points}</TableCell>
                  ))}
                  <TableCell>{data.totalPoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </>
      )}
    </Shell>
  )
}
