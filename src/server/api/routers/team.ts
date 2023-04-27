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
        return await ctx.prisma.team.create({
          data: data
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
