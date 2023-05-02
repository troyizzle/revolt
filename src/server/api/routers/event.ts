import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  getNext: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findFirst({
      where: {
        scheduledDate: {
          gt: new Date(),
        }
      }
    })
  }),
})
