import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure
  .input(z.object({
    userId: z.string()
  }))
  .query(({ ctx }) => {
    return ctx.prisma.profile.findUnique({
      where: {
        userId: ctx.input.userId
      },
    });
  })
})
