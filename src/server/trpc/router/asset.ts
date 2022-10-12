import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { AssetCreateInput, AssetEditInput } from "../../common/schemas/asset"
import { authedProcedure, t } from "../trpc"

export const assetRouter = t.router({
  findAll: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
          filter: z
            .object({
              typeId: z.number().optional(),
              classId: z.number().optional(),
              categoryId: z.number().optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const [assets, assetsCount] = await ctx.prisma.$transaction(
          [
            ctx.prisma.asset.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                category: true,
                class: true,
                type: true,
                manufacturer: true,
                vendor: true,
                model: true,
                location: true,
                custodian: true,
              },
              where: {
                NOT: {
                  deleted: true,
                },
                name: { contains: input?.search },
                number: { contains: input?.search },
                serial_number: { contains: input?.search },
                typeId: input?.filter?.typeId,
                classId: input?.filter?.classId,
                categoryId: input?.filter?.categoryId,
              },
              skip: input?.page
                ? (input.page - 1) * (input.limit ?? 10)
                : undefined,
              take: input?.limit ?? 10,
            }),
            ctx.prisma.asset.count(),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )

        return {
          assets,
          pages: Math.ceil(assetsCount / (input?.limit ?? 10)),
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const asset = await ctx.prisma.asset.findUnique({
      where: {
        id: input,
      },
      include: {
        category: true,
        class: true,
        type: true,
        manufacturer: true,
        vendor: true,
        model: true,
        location: true,
        custodian: true,
      },
    })
    return asset
  }),
  create: authedProcedure
    .input(AssetCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { model, ...rest } = input

      try {
        await ctx.prisma.$transaction(
          [
            ctx.prisma.asset.create({
              data: {
                ...rest,
              },
            }),
            ctx.prisma.asset.update({
              where: {
                number: rest.number,
              },
              data: {
                model: {
                  create: model ?? undefined,
                },
              },
            }),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )

        return "Asset successfully created"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  edit: authedProcedure
    .input(AssetEditInput)
    .mutation(async ({ ctx, input }) => {
      const { model, id, ...rest } = input

      try {
        await ctx.prisma.$transaction(
          [
            ctx.prisma.asset.update({
              where: {
                id,
              },
              data: {
                ...rest,
              },
            }),
            ctx.prisma.asset.update({
              where: {
                id,
              },
              data: {
                model: {
                  create: {
                    ...model,
                    name: model?.name ?? "",
                  },
                },
              },
            }),
          ],
          {}
        )
        return "Asset successfully edited"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.asset.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      })
      return "Asset successfully deleted"
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
        await ctx.prisma.asset.updateMany({
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
        return "Assets successfully deleted"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
