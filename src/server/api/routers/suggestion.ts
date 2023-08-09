import { suggestionNewSchema } from "~/schema/suggestion";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const suggestionRouter = createTRPCRouter({
  create: publicProcedure
    .input(suggestionNewSchema)
    .mutation(({ ctx, input: data }) => {
      return ctx.prisma.suggestion.create({
        data
      })
    }),
  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.suggestion.findMany({
        orderBy: {
          createdAt: "desc"
        }
      })
    }),
})
