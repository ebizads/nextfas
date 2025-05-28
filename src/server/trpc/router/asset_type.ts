import { z } from "zod"
import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"

export const assetTypeRouter = t.router({
  findOne: authedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const [assetType, relatedAssetsCount] = await ctx.prisma.$transaction([
        ctx.prisma.assetType.findUnique({
          where: { id: input },
          include: {
            assets: {
              select: {
                id: true,
                number: true,
                name: true,
              },
              where: {
                deleted: false,
              },
              take: 5,
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        }),
        ctx.prisma.asset.count({
          where: {
            typeId: input,
            deleted: false,
          },
        }),
      ])

      if (!assetType) {
        throw new Error('Asset type not found')
      }

      return {
        ...assetType,
        _count: {
          assets: relatedAssetsCount,
        },
      }
    }),

  findAll: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z
            .object({
              name: z.string().optional(),
              description: z.string().optional(),
            })
            .optional(),
          filter: z
            .object({
              updatedAt: z.date().optional(),
              deleted: z.boolean().optional().default(false),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const [assetTypes, count] = await ctx.prisma.$transaction([
        ctx.prisma.assetType.findMany({
          orderBy: {
            name: "asc",
          },
          where: {
            deleted: input?.filter?.deleted,
            name: input?.search?.name 
              ? { contains: input.search.name, mode: 'insensitive' } 
              : undefined,
            description: input?.search?.description
              ? { contains: input.search.description, mode: 'insensitive' }
              : undefined,
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.assetType.count({
          where: {
            deleted: input?.filter?.deleted,
            name: input?.search?.name 
              ? { contains: input.search.name, mode: 'insensitive' } 
              : undefined,
            description: input?.search?.description
              ? { contains: input.search.description, mode: 'insensitive' }
              : undefined,
          },
        }),
      ])

      return {
        assetTypes,
        count,
        total: count,
      }
    }),

  findAllSample: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z
            .object({
              name: z.string().optional(),
              description: z.string().optional(),
            })
            .optional(),
          filter: z
            .object({
              updatedAt: z.date().optional(),
              deleted: z.boolean().optional().default(false),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const [assetTypes, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.assetType.findMany({
              orderBy: {
                name: "asc",
              },
              where: {
                deleted: input?.filter?.deleted,
                updatedAt: input?.filter?.updatedAt,
                name: input?.search?.name
                  ? { contains: input.search.name, mode: "insensitive" }
                  : undefined,
                description: input?.search?.description
                  ? { contains: input.search.description, mode: "insensitive" }
                  : undefined,
              },
              skip: input?.page
                ? (input.page - 1) * (input.limit ?? 10)
                : undefined,
              take: input?.limit ?? 10,
            }),
            ctx.prisma.assetType.count({
              where: {
                deleted: input?.filter?.deleted,
                updatedAt: input?.filter?.updatedAt,
                name: input?.search?.name
                  ? { contains: input.search.name, mode: "insensitive" }
                  : undefined,
                description: input?.search?.description
                  ? { contains: input.search.description, mode: "insensitive" }
                  : undefined,
              },
            }),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )

        return {
          assetTypes,
          pages: Math.ceil(count / (input?.limit ?? 10)),
          total: count,
        }
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),

  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assetType = await ctx.prisma.assetType.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
  
      return assetType;
    }),

  delete: authedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.assetType.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      })
    }),

  deleteMany: authedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.assetType.updateMany({
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

        return "Asset Types deleted successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})