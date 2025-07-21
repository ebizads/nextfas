import { z } from "zod"
import { AssetCreateInput, HistoryLogCreateInput } from "../../schemas/asset"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"
import { startOfDay, endOfDay } from "date-fns"

export const historyLogRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const historyLog = await ctx.prisma.historyLogs.findUnique({
      where: {
        id: input,
      },
      include: {
        asset: {
          include: {
            type: true, // Added type relation
            actionType: true, // Added actionType relation
            department: {
              include: {
                location: true,
                company: true,
                teams: true,
                building: true,
              },
            },
            parent: true,
            custodian: true,
            vendor: true,
            management: true,
            addedBy: true,
            assetTag: true,
            AssetIssuance: true,
          },
        },
      },
    })
    return historyLog
  }),
  findOneWithBarcode: authedProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      const asset = await ctx.prisma.asset.findFirst({
        where: {
          serial_no: input,
        },
        include: {
          type: true, // Added type relation
          actionType: true, // Added actionType relation
          department: {
            include: {
              location: true,
              company: true,
              teams: true,
              building: true,
            },
          },
          parent: true,
          custodian: true,
          vendor: true,
          management: true,
          addedBy: true,
          assetTag: true,
          AssetIssuance: true,
        },
      })
      return asset
    }),
  findOneTable: authedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const asset = await ctx.prisma.asset.findUnique({
        where: {
          number: input,
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
          search: z.string().optional(),
          filter: z
            .object({
              updatedAt: z.date().optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const [historyLogs, count] = await ctx.prisma.$transaction([
        ctx.prisma.historyLogs.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            NOT: {
              deleted: true,
            },
            OR: [
              { gunNumber: { contains: input?.search, mode: "insensitive" } },
              { participant: { contains: input?.search, mode: "insensitive" } },
              { action: { contains: input?.search, mode: "insensitive" } },
            ],
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.historyLogs.count({
          where: {
            NOT: {
              deleted: true,
            },
            OR: [
              { gunNumber: { contains: input?.search, mode: "insensitive" } },
              { participant: { contains: input?.search, mode: "insensitive" } },
              { action: { contains: input?.search, mode: "insensitive" } },
            ],
          },
        }),
      ])

      return {
        historyLogs,
        count,
      }
    }),
  create: authedProcedure
    .input(HistoryLogCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { gunNumber, ...rest } = input

      // Create asset with type relation
      const historyLog = await ctx.prisma.historyLogs.create({
        data: {
          gunNumber: gunNumber ?? "",
          ...rest,
        },
      })

      return historyLog
    }),

  createMany: authedProcedure
    .input(
      z.array(
        AssetCreateInput.extend({
          typeId: z.number().optional(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      // Validate all types exist first
      const typeIds = input.map((i) => i.typeId).filter(Boolean) as number[]
      if (typeIds.length > 0) {
        const existingTypes = await ctx.prisma.assetType.findMany({
          where: { id: { in: typeIds } },
        })
        if (existingTypes.length !== new Set(typeIds).size) {
          throw new Error("One or more specified asset types do not exist")
        }
      }

      // Generate numbers for each asset
      const allAssets = await ctx.prisma.asset.findMany()
      const assetsWithNumbers = input.map((asset, index) => {
        let assetNumber = ""
        for (let x = 0; x <= (allAssets?.length || 0) + index + 1; x++) {
          const formattedNumber = `GUN-${String(
            (allAssets?.length || 0) + x + 1
          ).padStart(4, "0")}`
          if (!allAssets?.some((item) => item.number === formattedNumber)) {
            assetNumber = formattedNumber
            break
          }
        }
        return {
          ...asset,
          number: assetNumber,
        }
      })

      await ctx.prisma.asset.createMany({
        data: assetsWithNumbers,
        skipDuplicates: true,
      })

      return "Assets successfully created"
    }),
  findAssetTodayHistoryLogs: authedProcedure.query(async ({ ctx }) => {
    const today = new Date()
    const start = startOfDay(today)
    const end = endOfDay(today)
    try {
      const [
        // assetType,
        assetsInToday,
        assetsIssuedToday,
      ] = await ctx.prisma.$transaction([
        // ctx.prisma.historyLogs.findMany({
        //     where: {
        //         NOT: {
        //             deleted: true,
        //         },
        //         OR: {
        //             NOT: {
        //                 id: 999999,
        //             },
        //         },
        //     },
        //     include: {
        //         assets: {
        //             where: {
        //                 NOT: {
        //                     deleted: true,
        //                 },
        //                 OR: {
        //                     NOT: {
        //                         id: 999999,
        //                     },
        //                 },
        //             },
        //         },
        //     },
        // }),
        ctx.prisma.historyLogs.count({
          where: {
            NOT: {
              deleted: true,
            },
            OR: {
              NOT: {
                id: 999999,
              },
            },
            action: "in",
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        }),
        ctx.prisma.historyLogs.count({
          where: {
            NOT: {
              deleted: true,
            },
            OR: {
              NOT: {
                id: 999999,
              },
            },
            action: "issued",
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        }),
      ])
      // if (!data) throw new Error("An error has occured")

      return {
        // assetType,
        assetsInToday,
        assetsIssuedToday,
      }
    } catch (e) {
      console.log(e, "check err")
    }
  }),
})
