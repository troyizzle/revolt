import { z } from "zod";
import { createEventSchema, updateEventSchema } from "~/schema/event";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type PlayerRaceData = {
  player: string
  points: number[]
  totalPoints: number
}

export type RaceData = {
  players: PlayerRaceData[]
  events: {
    name: string,
    shortName: string
    id: string
  }[]
}

export const eventRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.event.findUnique({
        include: {
          races: {
            include: {
              PlayerRace: {
                include: {
                  player: true
                },
                orderBy: {
                  position: 'asc'
                }
              }
            }
          }
        },
        where: { id: input.id },
      })
    }),
  allWithRaceData: publicProcedure.query(async ({ ctx }) => {
    const data: RaceData = {
      players: [],
      events: []
    }

    const players = await ctx.prisma.player.findMany({
      include: {
        races: {
          include: {
            race: true
          }
        },
      },
    })

    const events = await ctx.prisma.event.findMany({
      orderBy: { order: 'asc' },
    })

    data.events = events.map((event) => ({
      name: event.name,
      shortName: event.shortName,
      id: event.id
    }))

    players.forEach((player) => {
      const playerData: PlayerRaceData = {
        player: player.name,
        points: [],
        totalPoints: 0
      }

      events.forEach((event) => {
        const raceEvent = player.races.find((race) => race.race.eventId === event.id)
        if (!raceEvent) {
          playerData.points.push(0)
        } else {
          playerData.points.push(raceEvent.points)
          playerData.totalPoints += raceEvent.points
        }
      })

      data.players.push(playerData)
    })

    data.players = data.players.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) {
        return -1
      } else if (a.totalPoints < b.totalPoints) {
        return 1
      } else {
        return 0
      }
    })

    return data
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany({
      orderBy: { order: 'asc' }
    })
  }),
  create: protectedProcedure.input(createEventSchema)
    .mutation(async ({ ctx, input: data }) => {
      const event = await ctx.prisma.event.create({
        data
      })

      return event
    }),
  update: protectedProcedure.input(updateEventSchema)
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.update({
        where: { id: input.id },
        data: { name: input.name, shortName: input.shortName }
      })

      return event
    }
    ),
})
