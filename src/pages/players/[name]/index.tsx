import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Chart as ChartJs, type ChartData, type ChartOptions, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

type RaceLineChartProps = {
  data: ChartData<'line'>;
  options: ChartOptions<'line'>;
}

function RaceLineChart({ data, options }: RaceLineChartProps) {
  console.log(data)
  ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  return (
    <Line
      data={data}
      options={options}
    />
  )
}

export default function Page() {
  const router = useRouter();
  const playerName = router.query.name as string;
  const player = api.player.get.useQuery({
    uniqueName: playerName,
  }, {
    enabled: !!playerName,
  });

  return (
    <div className="container mx-auto">
      {player.data && <div>
        <h1 className="text-center font-bold text-3xl mb-3">{player.data.name}</h1>
        <RaceLineChart
          data={{
            labels: player.data.races.map((race) => race.race.event.name),
            datasets: [
              {
                label: 'Position',
                data: player.data.races.map((race) => race.position),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              }
            ]
          }}
          options={{
            scales: {
              y: {
                reverse: true,
                beginAtZero: false,
                ticks: {
                  precision: 0
                }
              }
            }
          }}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Gap</TableHead>
              <TableHead>Best Lap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {player.data.races.map((race) => (
              <TableRow key={race.id}>
                <TableCell>{race.race.event.name}</TableCell>
                <TableCell>{race.position}</TableCell>
                <TableCell>{race.points}</TableCell>
                <TableCell>{race.car}</TableCell>
                <TableCell>{race.gap}</TableCell>
                <TableCell>{race.bestLap}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>}
    </div>
  )
}
