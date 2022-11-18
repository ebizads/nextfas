import { z } from "zod"
import { authedProcedure, t } from "../trpc"

export const assetClassRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetClass = await ctx.prisma.assetClass.findUnique({
      where: {
        id: input,
      },
      select: {
        categories: {
          select: {
            id: true,
            name: true,
            types: true,
          },
        },
      },
    })
    return assetClass
  }),
  findAll: authedProcedure.query(async ({ ctx }) => {
    const assetClasses = await ctx.prisma.assetClass.findMany({
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            types: true,
          },
        },
      },
    })
    return assetClasses
  }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assetClass = await ctx.prisma.assetClass.create({
        data: {
          name: input.name,
        },
      })
      return assetClass
    }),
})
