import { addRaceResultsInput } from "~/schema/race";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TOP_3_POINTS, racePoints } from "~/utils/importSessionData";


export const raceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addRaceResultsInput)
    .mutation(async ({ ctx, input }) => {
      const race = await ctx.prisma.race.create({
        data: { map: input.map, laps: input.laps, eventId: input.eventId }
      })

      const resultsSortedByBestLap = input.results.sort((a, b) => {
        if (a.bestLap < b.bestLap) return -1
        if (a.bestLap > b.bestLap) return 1
        return 0
      })

      resultsSortedByBestLap.map(async (result, index) => {
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
        points += TOP_3_POINTS[index + 1] || 0

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
