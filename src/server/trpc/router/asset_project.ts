import { z } from "zod"
import { authedProcedure, t } from "../trpc"

export const assetProjectRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetProject = await ctx.prisma.assetProject.findUnique({
      where: {
        id: input,
      },
    })
    return assetProject
  }),
  findAll: authedProcedure.query(async ({ ctx }) => {
    const assetProject = await ctx.prisma.assetProject.findMany()
    return assetProject
  }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assetProject = await ctx.prisma.assetProject.create({
        data: {
          name: input.name,
        },
      })
      return assetProject
    }),
})
