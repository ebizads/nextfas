import { z } from "zod"
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
            take: 5, // Limit the number of related assets returned
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
    ]);

    if (!assetType) {
      throw new Error('Asset type not found');
    }

    return {
      ...assetType,
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
    const [assetTypes, count] = await ctx.prisma.$transaction([
      ctx.prisma.assetType.findMany({
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
    ]);

    return {
      assetTypes,
      count,
    };
  }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assetTypes = await ctx.prisma.assetType.create({
        data: {
          name: input.name,
        },
      })
      return assetTypes
    }),
})
