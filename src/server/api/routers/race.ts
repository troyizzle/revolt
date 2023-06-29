import { addRaceResultsInput } from "~/schema/race";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { BEST_LAP_POINTS, SECOND_BEST_LAP_POINTS, THIRD_BEST_LAP_POINTS, TOP_3_POINTS, racePoints } from "~/utils/importSessionData";


export const raceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addRaceResultsInput)
    .mutation(async ({ ctx, input }) => {
      const race = await ctx.prisma.race.create({
        data: { map: input.map, laps: input.laps, eventId: input.eventId }
      })

      input.results.map(async (result, index) => {
        const { player: playerName, ...rest } = result
        const player = await ctx.prisma.player.upsert({
          where: {
            uniqueName: playerName.toLowerCase()
          },
          update: {},
          create: {
            name: playerName,
            uniqueName: playerName.toLowerCase(),
          }
        })

        let points = racePoints[result.position] || 0
        points += TOP_3_POINTS[result.position] || 0

        await ctx.prisma.playerRace.create({
          data: {
            points: points,
            raceId: race.id,
            playerId: player.id,
            ...rest
          }
        })
      })


      return race
    }),
})
