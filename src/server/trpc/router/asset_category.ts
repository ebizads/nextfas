import { z } from "zod"
import { authedProcedure, t } from "../trpc"

export const assetCategoryRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetCategory = await ctx.prisma.assetCategory.findUnique({
      where: {
        id: input,
      },
      select: {
        name: true,
        types: true,
      },
    })
    return assetCategory
  }),
  findAll: authedProcedure.query(async ({ ctx }) => {
    const assetCategory = await ctx.prisma.assetCategory.findMany({
      select: {
        name: true,
        types: true,
      },
    })
    return assetCategory
  }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assetCategory = await ctx.prisma.assetCategory.create({
        data: {
          name: input.name,
        },
      })
      return assetCategory
    }),
})
