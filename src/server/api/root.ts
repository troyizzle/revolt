import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { raceRouter } from "./routers/race";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  race: raceRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
