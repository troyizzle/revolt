import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createPlayerSchema } from "~/schema/player";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const playerRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.player.findMany({
      include: {
        user: true,
      }
    })
  }),
  getAllWithScore: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.$queryRaw<{ id: string, name: string, totalPoints?: number }[]>(
      Prisma.sql`SELECT "Player"."id", "Player"."name", "PlayerScore"."totalPoints"
      FROM "Player"
      LEFT JOIN (
        SELECT "Player"."id", SUM("PlayerRace"."points") AS "totalPoints"
        FROM "Player"
        LEFT JOIN "PlayerRace" ON "Player"."id" = "PlayerRace"."playerId"
        GROUP BY "Player"."id"
      ) AS "PlayerScore" ON "Player"."id" = "PlayerScore"."id"
      ORDER BY "totalPoints" DESC`
    )
  }),
  create: protectedProcedure
    .input(createPlayerSchema)
    .mutation(({ ctx, input }) => {
      try {
        return ctx.prisma.player.create({
          data: {
            name: input.name,
            uniqueName: input.name.toLowerCase(),
          }
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "PARSE_ERROR",
              message: "Player name already exists",
            })
          }
        }
      }
    }),
})
