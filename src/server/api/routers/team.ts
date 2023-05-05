import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTeamSchema } from "~/schema/team";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(createTeamSchema)
    .mutation(async ({ input: data, ctx }) => {
      try {
        const { players, ...rest } = data;
        return await ctx.prisma.team.create({
          data: {
            ...rest,
            players: {
              connect: players.map((playerId) => ({
                id: playerId,
              })),
            }
          },
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "PARSE_ERROR",
              message: "Team name already exists",
            })
          }
        }
      }
    }),
  getTeams: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.team.findMany();
    }
    ),
});
