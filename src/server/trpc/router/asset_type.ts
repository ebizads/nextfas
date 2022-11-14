import { z } from "zod"
import { authedProcedure, t } from "../trpc"

export const assetTypeRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetType = await ctx.prisma.assetType.findUnique({
      where: {
        id: input,
      },
    })
    return assetType
  }),
  findAll: authedProcedure.query(async ({ ctx }) => {
    const assetTypes = await ctx.prisma.assetType.findMany({})
    return assetTypes
  }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assetTypes = await ctx.prisma.assetType.create({
        data: {
          name: input.name,
        },
      })
      return assetTypes
    }),
})
