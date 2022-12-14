import { z } from "zod"
import { authedProcedure, t } from "../trpc"
import {
  AssetDisposalCreateInput,
  AssetDisposalEditInput,
} from "../../schemas/asset"
import { TRPCError } from "@trpc/server"

export const assetDisposalRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetDisposal = await ctx.prisma.assetDisposal.findUnique({
      where: {
        id: input,
      },
      include: {
        asset: true,
        disposalType: true,
      },
    })
    return assetDisposal
  }),
  findAll: authedProcedure
    .input(
      z
        .object({
          disposalDate: z.date().optional(),
          completionDate: z.date().optional(),
          disposalStatus: z.string().optional(),
          departmentCode: z.string().optional(),
          customerName: z.string().optional(),
          telephoneNo: z.string().optional(),
          salesAmount: z.number().optional(),
          salesInvoice: z.string().optional(),
          apInvoice: z.string().optional(),
          agreedPrice: z.number().optional(),
          disposalPrice: z.number().optional(),
          cufsCodeString: z.string().optional(),
          assetId: z.number().optional(),
          disposalTypeId: z.number().optional(),
          filter: z
            .object({
              updatedAt: z.date().optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const [assetDisposals, count] = await ctx.prisma.$transaction([
        ctx.prisma.assetDisposal.findMany({
          orderBy: {
            createdAt: "asc",
          },
          include: {
            asset: true,
            disposalType: true,
          },
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
        ctx.prisma.assetDisposal.count({
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
      ])

      return {
        assetDisposals,
        count,
      }
    }),
  create: authedProcedure
    .input(AssetDisposalCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { assetId, disposalTypeId, ...rest } = input

      const assetDisposal = await ctx.prisma.assetDisposal.create({
        data: {
          asset: {
            connect: {
              id: assetId,
            },
          },
          disposalType: {
            connect: {
              id: disposalTypeId,
            },
          },
          ...rest,
        },
        include: {
          asset: true,
          disposalType: true,
        },
      })
      return assetDisposal
    }),
  edit: authedProcedure
    .input(AssetDisposalEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      try {
        await ctx.prisma.assetDisposal.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        })

        return "Asset updated successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
