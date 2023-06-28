import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createEventSchema, scheduleEventSchema, updateEventSchema } from "~/schema/event";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    type eventAll = {
      id: string,
      date?: Date,
      scheduledDate?: Date,
      track?: string,
      laps?: number,
      ip?: string,
      serverStatus: string
      resultsUrl?: string
    }
    return ctx.prisma.$queryRaw<eventAll[]>(
      Prisma.sql`SELECT "Event"."id",
        "Event"."date",
        "Event"."scheduledDate",
        "Event"."track",
        "Event"."laps",
        "Event"."ip",
        "Event"."serverStatus",
        "Event"."resultsUrl"
      FROM "Event"
      ORDER BY
        CASE WHEN "Event"."serverStatus" = 'END' THEN 1
          WHEN "Event"."serverStatus" = 'CLOSED' THEN 2
          ELSE 3
        END,
        "Event"."date" DESC,
        "Event"."scheduledDate" ASC`
    )
  }),
  schedule: protectedProcedure.input(scheduleEventSchema).mutation(
    ({ input, ctx }) => {
      return ctx.prisma.event.create({
        data: {
          scheduledDate: input.scheduledDate,
          createdById: ctx.session.user.id,
          serverStatus: 'CREATED',
        },
      })
    }
  ),
  getNext: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findFirst({
      where: {
        scheduledDate: {
          gt: new Date(),
        }
      }
    })
  }),
  get: protectedProcedure.input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.event.findUnique({
        where: {
          id: input.id,
        },
      })
    }
  ),
  update: protectedProcedure
  .input(updateEventSchema)
  .mutation(({ input, ctx }) => {
    return ctx.prisma.event.update({
      where: {
        id: input.id,
      },
      data: {
        ...input
      }
    })
  })
})
