import { createSeasonSchema, updateSeasonSchema } from "~/schema/season";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const seasonRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.season.findMany({
      include: {
        League: {
          select: {
            name: true
          }
        }
      }
    });
  }),
  create: protectedProcedure.input(createSeasonSchema).mutation(
    ({ ctx, input: data }) => {
      return ctx.prisma.season.create({ data });
    }
  ),
  update: protectedProcedure.input(updateSeasonSchema).mutation(
    ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.season.update({
        where: {
          id,
        },
        data,
      });
    }
  ),
})
