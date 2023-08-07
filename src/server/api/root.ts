import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { raceRouter } from "./routers/race";
import { eventRouter } from "./routers/event";
import { seasonRouter } from "./routers/season";
import { leagueRouter } from "./routers/league";
import { playerRouter } from "./routers/player";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  league: leagueRouter,
  player: playerRouter,
  race: raceRouter,
  season: seasonRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
