import { z } from "zod"
import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"

export const assetActionTypeRouter = t.router({
  findOne: authedProcedure
  .input(z.number())
  .query(async ({ ctx, input }) => {
    const [assetActionType, relatedAssetsCount] = await ctx.prisma.$transaction([
      ctx.prisma.assetActionType.findUnique({
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
            take: 5, // Limit the number of related assets returned
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      }),
      ctx.prisma.asset.count({
        where: {
          actionTypeId: input,
          deleted: false,
        },
      }),
    ]);

    if (!assetActionType) {
      throw new Error('Asset type not found');
    }

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
            deleted: z.boolean().optional().default(false),
          })
          .optional(),
      })
      .optional()
  )
  .query(async ({ ctx, input }) => {
    const [assetActionTypes, count] = await ctx.prisma.$transaction([
      ctx.prisma.assetActionType.findMany({
        orderBy: {
          name: "asc", // Changed from createdAt to name for more logical sorting
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
      ctx.prisma.assetActionType.count({
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
            deleted: z.boolean().optional().default(false),
          })
          .optional(),
      })
      .optional()
  )
  .query(async ({ ctx, input }) => {
    try {
      const [assetActionTypes, count] = await ctx.prisma.$transaction(
        [
          ctx.prisma.assetActionType.findMany({
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
          ctx.prisma.assetActionType.count({
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

})
