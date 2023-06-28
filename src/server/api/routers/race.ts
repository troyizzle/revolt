import { addRaceResultsSchema } from "~/schema/race";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { BEST_LAP_POINTS, SECOND_BEST_LAP_POINTS, THIRD_BEST_LAP_POINTS, racePoints, tokens } from "~/utils/importSessionData";


export const raceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addRaceResultsSchema)
    .mutation(async ({ ctx, input }) => {
      const race = await ctx.prisma.race.create({
        data: { map: input.map, laps: input.laps }
      })

      input.results.forEach(async (result, index) => {
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
        // TODO: Change this
        if (index === 0) {
          points += BEST_LAP_POINTS
        }

        if (index === 1) {
          points += SECOND_BEST_LAP_POINTS
        }

        if (index === 2) {
          points += THIRD_BEST_LAP_POINTS
        }

        await ctx.prisma.playerRace.create({
          data: {
            points: points,
            tokens: tokens[result.position] || 5,
            raceId: race.id,
            playerId: player.id,
            ...rest
          }
        })
      })


      return race
    }),
})
