import { z } from "zod"
import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"

export const assetTypeRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const [assetType, relatedAssetsCount] = await ctx.prisma.$transaction([
      ctx.prisma.assetType.findUnique({
        where: {
          id: input,
        },
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
              createdAt: "desc",
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
      throw new Error("Asset type not found")
    }

    return {
      ...assetType,
      _count: {
        assets: relatedAssetsCount,
      },
    }
  }),

  findOneDashboard: authedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const item = ctx.prisma.assetType.findUnique({
        where: {
          id: input,
        },
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
              createdAt: "desc",
            },
          },
        },
      })

      if (!item) {
        throw new Error("Asset type not found")
      }

      return item
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
              deleted: z.boolean().optional().default(false), // Keep optional but default to false
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      // Set default deleted filter to false if not provided
      const deletedFilter = input?.filter?.deleted ?? false

      const [assetTypes, count] = await ctx.prisma.$transaction([
        ctx.prisma.assetType.findMany({
          orderBy: {
            id: "asc",
          },
          where: {
            deleted: deletedFilter, // Use the computed deleted filter
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
            deleted: deletedFilter, // Use the computed deleted filter
            name: input?.search?.name
              ? { contains: input.search.name, mode: "insensitive" }
              : undefined,
            description: input?.search?.description
              ? { contains: input.search.description, mode: "insensitive" }
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
              deleted: z.boolean().optional().default(false), // Keep optional but default to false
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        // Set default deleted filter to false if not provided
        const deletedFilter = input?.filter?.deleted ?? false

        const [assetTypes, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.assetType.findMany({
              orderBy: {
                id: "asc",
              },
              where: {
                deleted: deletedFilter, // Use the computed deleted filter
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
                deleted: deletedFilter, // Use the computed deleted filter
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
      // Check if a non-deleted assetType with the same name exists
      const existing = await ctx.prisma.assetType.findFirst({
        where: {
          name: input.name,
          deleted: false, // only block if not soft-deleted
        },
      })

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An asset type with this name already exists",
        })
      }

      const assetType = await ctx.prisma.assetType.create({
        data: {
          name: input.name,
          description: input.description,
        },
      })

      return assetType
    }),

  delete: authedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
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
  update: authedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First verify the asset type exists
        const existingType = await ctx.prisma.assetType.findUnique({
          where: { id: input.id },
        })

        if (!existingType) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Asset type not found",
          })
        }

        // Check if name is already taken by another type
        const nameExists = await ctx.prisma.assetType.findFirst({
          where: {
            name: input.name,
            id: { not: input.id }, // Exclude current type from check
            deleted: false,
          },
        })

        if (nameExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "An asset type with this name already exists",
          })
        }

        // Update the asset type
        const updatedType = await ctx.prisma.assetType.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description ? input.description : "",
            updatedAt: new Date(),
          },
        })

        return updatedType
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error(error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update asset type",
        })
      }
    }),
})
