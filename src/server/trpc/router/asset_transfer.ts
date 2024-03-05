import { z } from "zod"
import { authedProcedure, t } from "../trpc"
import {
  AssetTransferCreateInput,
  AssetTransferEditInput,
} from "../../schemas/asset"
import { TRPCError } from "@trpc/server"

export const assetTransferRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetTransfer = await ctx.prisma.assetTransfer.findUnique({
      where: {
        id: input,
      },
      include: {
        asset: {
          include: {
            pastIssuance: true,
            issuedBy: true,
            issuedTo: true,
          },
        },
      },
    })
    return assetTransfer
  }),
  findAsset: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetTransfer = await ctx.prisma.assetTransfer.findUnique({
      where: {
        assetId: input,
      },
    })
    return assetTransfer
  }),
  findAll: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z
            .object({
              transferDate: z.date().optional(),
              transferStatus: z.string().optional(),
              transferLocation: z.string().optional(),
              departmentCode: z.string().nullish().optional(),
              remarks: z.string().nullish().optional(),
              custodianId: z.number().optional(),
              assetId: z.number().optional(),
            })
            .optional(),
          filter: z
            .object({
              updatedAt: z.date().optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const [assetTransfers, count] = await ctx.prisma.$transaction([
        ctx.prisma.assetTransfer.findMany({
          orderBy: {
            createdAt: "desc",
          },
          include: {
            asset: true,
          },
          where: {
            transferStatus: input?.search?.transferStatus,
            NOT: {
              deleted: true,
            },
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.assetTransfer.count({
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
      ])

      return {
        assetTransfers,
        count,
        pages: Math.ceil(count / (input?.limit ?? 0)),
        total: count,
      }
    }),
  create: authedProcedure
    .input(AssetTransferCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { assetId, ...rest } = input

      const assetTransfer = await ctx.prisma.assetTransfer.create({
        data: {
          asset: {
            connect: {
              id: assetId,
            },
          },

          ...rest,
        },
        include: {
          asset: {
            include: {
              pastIssuance: true,
              issuedBy: true,
              issuedTo: true,
            },
          },
        },
      })
      return assetTransfer
    }),
  edit: authedProcedure
    .input(AssetTransferEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, assetId, ...rest } = input
      try {
        await ctx.prisma.assetTransfer.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
          include: {
            asset: {
              include: {
                pastIssuance: true,
                issuedBy: true,
                issuedTo: true,
              },
            },
          },
        })

        // await ctx.prisma.assetIssuance.create({
        //   data: {
        //     asset: {
        //       connect: {
        //         id: assetId ?? 0,
        //       },
        //     },

        //     ...rest,
        //   },
        // })

        return "Asset updated successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
