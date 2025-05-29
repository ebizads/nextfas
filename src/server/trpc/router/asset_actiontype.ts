import { z } from "zod"
import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"

export const assetActionTypeRouter = t.router({
  findOne: authedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const assetActionType = await ctx.prisma.assetActionType.findUnique({
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
      });

      // Manual check for deleted status
      if (!assetActionType || assetActionType.deleted) {
        throw new Error('Asset action type not found');
      }

      const relatedAssetsCount = await ctx.prisma.asset.count({
        where: {
          actionTypeId: input,
          deleted: false,
        },
      });

      return {
        ...assetActionType,
        _count: {
          assets: relatedAssetsCount,
        },
      };
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
              deleted: z.boolean().optional().default(false), // Default to false
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      // Set default deleted filter to false if not provided
      const deletedFilter = input?.filter?.deleted ?? false;

      const [assetActionTypes, count] = await ctx.prisma.$transaction([
        ctx.prisma.assetActionType.findMany({
          orderBy: {
            name: "asc",
          },
          where: {
            deleted: deletedFilter,
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
        ctx.prisma.assetActionType.count({
          where: {
            deleted: deletedFilter,
            name: input?.search?.name
              ? { contains: input.search.name, mode: 'insensitive' }
              : undefined,
            description: input?.search?.description
              ? { contains: input.search.description, mode: 'insensitive' }
              : undefined,
          },
        }),
      ]);

      return {
        assetActionTypes,
        count,
        total: count,
      };
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
              deleted: z.boolean().optional().default(false), // Default to false
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        // Set default deleted filter to false if not provided
        const deletedFilter = input?.filter?.deleted ?? false;

        const [assetActionTypes, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.assetActionType.findMany({
              orderBy: {
                name: "asc",
              },
              where: {
                deleted: deletedFilter,
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
            ctx.prisma.assetActionType.count({
              where: {
                deleted: deletedFilter,
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
        );

        return {
          assetActionTypes,
          pages: Math.ceil(count / (input?.limit ?? 10)),
          total: count,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
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
      const assetActionType = await ctx.prisma.assetActionType.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return assetActionType;
    }),
  delete: authedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.assetActionType.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
    }),

  deleteMany: authedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.assetActionType.updateMany({
          where: {
            id: {
              in: input,
            },
          },
          data: {
            deleted: true,
            deletedAt: new Date(),
          },
        });

        return "Asset Action Types deleted successfully";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
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
      .mutation(async({ ctx, input}) => {
        try {
          // First verify the asset type exists
          const existingType = await ctx.prisma.assetActionType.findUnique({
            where: { id: input.id },
          });

          if (!existingType) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Asset type not found",
            });
          }

          // Check if name is already taken by another type
          const nameExists = await ctx.prisma.assetActionType.findFirst({
            where: {
              name: input.name,
              id: { not: input.id },
              deleted: false,
            }
          });

          if (nameExists) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "An asset type with this name already exists",
            });
          }

          //Update the asset type
          const updatedType = await ctx.prisma.assetActionType.update({
            where: { id: input.id },
            data: {
              name: input.name,
              description: input.description,
              updatedAt: new Date(),
            },
          });

          return updatedType;
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error(error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update asset type",
          })
        }
      }),

})
