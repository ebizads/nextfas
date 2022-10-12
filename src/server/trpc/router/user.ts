import { z } from "zod"
import { EditUserInput } from "../../common/schemas/user"
import { authedProcedure, t } from "../trpc"

export const userRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
    })
  }),
  findAll: authedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({})
  }),
  update: authedProcedure
    .input(EditUserInput)
    .mutation(async ({ input, ctx }) => {
      const { address, id, ...rest } = input
      return await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...rest,
          address: {
            create: address,
          },
        },
      })
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.user.update({
      where: {
        id: input,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    })
  }),
})
