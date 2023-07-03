import { createLeagueSchema, updateLeagueSchema } from "~/schema/league";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const leagueRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.league.findMany();
  }),
  create: protectedProcedure.input(createLeagueSchema).mutation(
    ({ ctx, input: data }) => {
      return ctx.prisma.league.create({ data });
    }),
  update: protectedProcedure.input(updateLeagueSchema).mutation(
    ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.league.update({
        where: {
          id,
        },
        data
      })
    }
  ),
})
