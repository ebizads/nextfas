import { z } from "zod"
import { authedProcedure, t } from "../trpc"

export const assetDisposalRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const disposalType = await ctx.prisma.disposalType.findUnique({
      where: {
        id: input,
      },
      include: {
        disposal: true,
      },
    })
    return disposalType
  }),
  findAll: authedProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
          filter: z
            .object({
              updatedAt: z.date().optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const [disposalTypes, count] = await ctx.prisma.$transaction([
        ctx.prisma.disposalType.findMany({
          orderBy: {
            createdAt: "asc",
          },
          include: {
            disposal: true,
          },
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
        ctx.prisma.disposalType.count({
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
      ])

      return {
        disposalTypes,
        count,
      }
    }),
})
