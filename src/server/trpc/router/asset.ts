import { z } from "zod"
import { AssetCreateInput } from "../../schemas/asset"
import { authedProcedure, t } from "../trpc"

export const assetRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const asset = await ctx.prisma.asset.findUnique({
      where: {
        id: input,
      },
      include: {
        model: true,
        custodian: true,
        location: true,
        vendor: true,
        management: true,
      },
    })
    return asset
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
              number: z.string(),
              serial_no: z.string().optional(),
              barcode: z.string().optional(),
              description: z.string().optional(),
              remarks: z.string().optional(),
              custodianId: z.number().optional(),
              locationId: z.number().optional(),
              vendorId: z.number().optional(),
              subsidiaryId: z.number().optional(),
              projectId: z.number().optional(),
              parentId: z.number().optional(),
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
      const [assets, count] = await ctx.prisma.$transaction([
        ctx.prisma.asset.findMany({
          orderBy: {
            createdAt: "asc",
          },
          include: {
            model: true,
            custodian: true,
            location: true,
            vendor: true,
            management: true,
          },
          where: {
            NOT: {
              deleted: true,
            },
            name: { contains: input?.search?.name },
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.asset.count(),
      ])

      return {
        assets,
        count,
      }
    }),
  create: authedProcedure
    .input(AssetCreateInput)
    .mutation(async ({ ctx, input }) => {
      const {
        management,
        custodianId,
        locationId,
        model,
        vendorId,
        subsidiaryId,
        projectId,
        parentId,
        ...rest
      } = input

      const asset = await ctx.prisma.asset.create({
        data: {
          ...rest,
          model: {
            connectOrCreate: {
              where: {
                id: 0,
              },
              create: model,
            },
          },
          management: {
            connectOrCreate: {
              where: {
                id: 0,
              },
              create: management,
            },
          },
          custodian: {
            connect: {
              id: custodianId,
            },
          },
          location: {
            connect: {
              id: locationId,
            },
          },
          vendor: {
            connect: {
              id: vendorId,
            },
          },
          subisidiary: {
            connect: {
              id: subsidiaryId,
            },
          },
          project: {
            connect: {
              id: projectId,
            },
          },
          parent: {
            connect: {
              id: parentId,
            },
          },
        },
        include: {
          model: true,
          custodian: true,
          location: true,
          vendor: true,
          management: true,
        },
      })
      return asset
    }),
})
