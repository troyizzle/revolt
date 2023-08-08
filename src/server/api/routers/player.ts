import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const playerRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.player.findMany();
    }),
  get: publicProcedure
    .input(z.object({ uniqueName: z.string() }))
    .query(({ ctx, input }) => {
      const uniqueName = input.uniqueName.toLowerCase();

      return ctx.prisma.player.findUnique({
        where: {
          uniqueName
        },
        include: {
          races: {
            orderBy: {
              race: {
                event: {
                  order: 'asc'
                }
              }
            },
            include: {
              race: {
                include: {
                  event: true
                },
              }
            },
          }
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.player.delete({
        where: {
          id: input.id,
        },
      });
    }),
})
