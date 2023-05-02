import moment from "moment";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { RouterOutputs, api } from "~/utils/api";
import Navbar from "~/components/UI/Navbar";

type LeaderboardProps = {
  players: playersWithScore;
}

function Leaderboard({ players }: LeaderboardProps) {
  return (
    <div className="w-full overflow-auto">
      <table id="leaderboard" className="table w-full">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Points</th>
            <th>Races</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

type PlayerRowProps = {
  player: playersWithScore[0];
}

function PlayerRow({ player }: PlayerRowProps) {
  return (
    <tr>
      <td>{player.name}</td>
      <td>{player.score}</td>
      <td>{player.races}</td>
      <td>{player.average}</td>
    </tr>
  )
}

function NextEvent() {
  const nextEvent = api.event.getNext.useQuery();

  if (!nextEvent.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mt-2">
      <div className="flex justify-center text-2xl md:text-3xl uppercase">
        Next event
      </div>
      <div className="flex justify-center text-2xl md:text-3xl uppercase">
        {nextEvent.data.scheduledDate && moment(new Date(nextEvent.data.scheduledDate).toLocaleString()).format("YYYY-MM-DD")}
      </div>
    </div>
  )
}

type playersWithScore = RouterOutputs['player']['getAllWithScore'];

const Home: NextPage = () => {
  const { data: session } = useSession();
  const playersWithScore = api.player.getAllWithScore.useQuery();

  if (!playersWithScore.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Revolt</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full mt-2">
        <Navbar session={session} />
        <NextEvent />
        <Leaderboard players={playersWithScore.data} />
      </main>
    </>
  );
};

export default Home;
