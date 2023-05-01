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
    type playerTableData = {
      id: string,
      name: string,
      score?: number,
      races?: number,
      average?: number,
    }
    return ctx.prisma.$queryRaw<playerTableData[]>(
      Prisma.sql`SELECT "Player"."id",
      "Player"."name",
      "PlayerScore"."score",
      "PlayerScore"."races",
      "PlayerScore"."average"
      FROM "Player"
      LEFT JOIN (
        SELECT "Player"."id",
          SUM("PlayerRace"."points")::integer AS "score",
          COUNT("PlayerRace"."id")::integer AS "races",
          CASE
            WHEN COUNT("PlayerRace"."id") = 0 THEN 0
            WHEN SUM("PlayerRace"."points") = 0 THEN 0
            ELSE ROUND((cast(SUM("PlayerRace"."points") as decimal) / COUNT("PlayerRace"."id")), 2)
          END AS "average"

        FROM "Player"
        LEFT JOIN "PlayerRace" ON "Player"."id" = "PlayerRace"."playerId"
        GROUP BY "Player"."id"
      ) AS "PlayerScore" ON "Player"."id" = "PlayerScore"."id"
      ORDER BY "score" DESC`
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
