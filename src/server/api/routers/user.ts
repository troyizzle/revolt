import { userUpdateSchema } from "~/schema/user";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  update: protectedProcedure
    .input(userUpdateSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.prisma.user.update({
        where: {
          id
        },
        data
      });
    })
})
