import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { RouterOutputs, api } from "~/utils/api";

type LeaderboardProps = {
  players: playersWithScore;
}

function Leaderboard({ players }: LeaderboardProps) {
  return (
    <div id="leaderboard" className="flex flex-col space-y-2 items-center w-full">
      {players.map((player) => (
        <PlayerRow key={player.id} player={player} />
      ))}
    </div>
  )
}

type PlayerRowProps = {
  player: playersWithScore[0];
}

function PlayerRow({ player }: PlayerRowProps) {
  return (
    <div className="flex flex-row items-center">
      {player.name} - {player.totalPoints?.toString()}
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
        {!session && (
          <button onClick={() => signIn()}>Sign in</button>
        )}
        <div className="flex justify-center text-2xl md:text-3xl uppercase">
          Current Revolt Season
        </div>
        <Leaderboard players={playersWithScore.data} />
      </main>
    </>
  );
};

export default Home;
