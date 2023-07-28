import { z } from "zod"
import { ManagementEditInput } from "../../schemas/model"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"

export const assetManagementRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const assetManagement = await ctx.prisma.assetManagement.findUnique({
      where: {
        assetId: input,
      },
      include: {
        asset: true,
      },
    })
    return assetManagement
  }),
  findAll: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z
            .object({
              currency: z.string().optional().nullish(),
              original_cost: z.number().optional().nullish(),
              current_cost: z.number().optional().nullish(),
              residual_value: z.number().nullish().nullish(),
              residual_percentage: z.number().nullish().nullish(),
              purchase_date: z.date().nullish(),

              depreciation_start: z.date().nullish(),
              depreciation_end: z.date().nullish(),
              depreciation_status: z.string().nullish(),
              depreciation_period: z.number().nullish(),
              depreciation_lifetime: z.number().nullish(),
              depreciation_rule: z.string().nullish(),
              asset_lifetime: z.number().nullish(),
              asset_location: z.string().nullish(),
              accounting_method: z.string().nullish(),
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
      const [assetManagements, count] = await ctx.prisma.$transaction([
        ctx.prisma.assetManagement.findMany({
          orderBy: {
            createdAt: "asc",
          },
          include: {
            asset: true,
          },
          where: {
            NOT: {
              deleted: true,
            },
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.assetManagement.count({
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
      ])

      return {
        assetManagements,
        count,
      }
    }),
  edit: authedProcedure
    .input(ManagementEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      try {
        await ctx.prisma.assetManagement.update({
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
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.assetManagement.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      })

      return "Asset deleted successfully"
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: JSON.stringify(error),
      })
    }
  }),
  deleteMany: authedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.assetManagement.updateMany({
          where: {
            id: {
              in: input,
            },
          },
          data: {
            deleted: true,
            deletedAt: new Date(),
          },
        })

        return "Assets deleted successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  // editCustodian: authedProcedure
  //   .input(AssetEditKevinInput)
  //   .mutation(async ({ ctx, input }) => {
  //     const { id, departmentId, ...rest } = input

  //     try {
  //       await ctx.prisma.assetManagement.update({
  //         where: {
  //           id,
  //         },
  //         data: {
  //           department: {
  //             update: {
  //               id: departmentId ?? 0,
  //             },
  //           },

  //           ...rest,
  //         },
  //       })

  //       return "Asset updated successfully"
  //     } catch (error) {
  //       throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: JSON.stringify(error),
  //       })
  //     }
  //   }),
})
