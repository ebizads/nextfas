import { z } from "zod"
import {
  AssetCreateInput,
  AssetEditInput,
  AssetTransformInput,
  AssetUpdateInput,
} from "../../schemas/asset"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"
import { startOfDay, endOfDay } from "date-fns"

export const assetRouter = t.router({
  findOne: authedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const asset = await ctx.prisma.asset.findUnique({
      where: {
        number: input,
      },
      include: {
        type: true, // Added type relation
        actionType: true, // Added actionType relation
        ViewerList: true,
        // department: {
        //   include: {
        //     location: true,
        //     company: true,
        //     teams: true,
        //     building: true,
        //   },
        // },
        // parent: true,
        // custodian: true,
        // vendor: true,
        // management: true,
        // addedBy: true,
        // assetTag: true,
        // AssetIssuance: true,
      },
    })
    return asset
  }),
  findOneWithBarcode: authedProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      const asset = await ctx.prisma.asset.findFirst({
        where: {
          number: input ?? undefined,
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

  findAssetToday: authedProcedure.query(async ({ ctx }) => {
    const today = new Date()
    const start = startOfDay(today)
    const end = endOfDay(today)
    try {
      const [assetType, assetsInToday, assetsIssuedToday] =
        await ctx.prisma.$transaction([
          ctx.prisma.assetType.findMany({
            where: {
              NOT: {
                deleted: true,
              },
              OR: {
                NOT: {
                  id: 999999,
                },
              },
            },
            include: {
              assets: {
                where: {
                  NOT: {
                    deleted: true,
                  },
                  OR: {
                    NOT: {
                      id: 999999,
                    },
                  },
                },
              },
            },
          }),
          ctx.prisma.asset.count({
            where: {
              NOT: {
                deleted: true,
              },
              OR: {
                NOT: {
                  id: 999999,
                },
              },
              // status: "in",
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          }),
          ctx.prisma.asset.count({
            where: {
              NOT: {
                deleted: true,
              },
              OR: {
                NOT: {
                  id: 999999,
                },
              },
              // status: "issued",
              issuedAt: {
                gte: start,
                lte: end,
              },
            },
          }),
        ])
      // if (!data) throw new Error("An error has occured")

      return { assetType, assetsInToday, assetsIssuedToday }
    } catch (e) {
      console.log(e, "check err")
    }
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
              actionType: z.array(z.string().optional()).optional(),
              type: z.array(z.string().optional()).optional(),
              status: z.array(z.string().optional()).optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      //filters out empty string, properly check if it has a value
      const typeNames = input?.filter?.type?.filter(
        (x): x is string => typeof x === "string"
      )
      const actionTypeNames = input?.filter?.actionType?.filter(
        (x): x is string => typeof x === "string"
      )
      const statusNames = input?.filter?.status?.filter(
        (x): x is string => typeof x === "string"
      )
      // console.log("check filter, ", input)
      const [assets, count] = await ctx.prisma.$transaction([
        ctx.prisma.asset.findMany({
          orderBy: {
            createdAt: "desc",
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
            ViewerList: true,
          },
          where: {
            NOT: {
              deleted: true,
            },
            ...(input?.search && {
              OR: [
                { name: { contains: input.search, mode: "insensitive" } },
                { number: { contains: input.search, mode: "insensitive" } },
              ],
            }),
            ...(actionTypeNames?.length && {
              actionType: {
                name: { in: actionTypeNames },
              },
            }),
            ...(typeNames?.length && {
              type: {
                name: { in: typeNames },
              },
            }),
            ...(statusNames?.length && {
              status: { in: statusNames },
            }),
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.asset.count({
          where: {
            NOT: {
              deleted: true,
            },

            ...(input?.search && {
              OR: [
                { name: { contains: input.search, mode: "insensitive" } },
                { number: { contains: input.search, mode: "insensitive" } },
              ],
            }),
            ...(actionTypeNames?.length && {
              actionType: {
                name: { in: actionTypeNames },
              },
            }),
            ...(typeNames?.length && {
              type: {
                name: { in: typeNames },
              },
            }),
            ...(statusNames?.length && {
              status: { in: statusNames },
            }),
          },
        }),
      ])

      console.log(assets, count, "check assets count")
      return {
        assets,
        count,
      }
    }),

  findAllDashboard: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z
            .object({
              name: z.string().optional(),
              number: z.string().optional(),
              serial_no: z.string().optional(),
              barcode: z.string().optional(),
              description: z.string().optional(),
              remarks: z.string().optional(),
              invoiceNum: z.string().optional(),
              purchaseOrder: z.string().optional(),
              deployment_status: z.string().optional(),
              custodianId: z.number().optional(),
              departmentId: z.number().optional(),
              vendorId: z.number().optional(),
              subsidiaryId: z.number().optional(),
              assetProjectId: z.number().optional(),
              parentId: z.number().optional(),
              typeId: z.number().optional(),
              actionTypeId: z.number().optional(), // Added typeId to search
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
      const today = new Date()
      const start = startOfDay(today)
      const end = endOfDay(today)
      const [assets, count, allCount] = await ctx.prisma.$transaction([
        ctx.prisma.asset.findMany({
          orderBy: {
            createdAt: "desc",
          },
          include: {
            type: true, // Added type relation
            actionType: true, // Added actionType relation
            ViewerList: true,
            // department: {
            //   include: {
            //     location: true,
            //     company: true,
            //     teams: true,
            //     building: true,
            //   },
            // },
            // parent: true,
            // custodian: true,
            // vendor: true,
            // management: true,
            // addedBy: true,
            // assetTag: true,
            // AssetIssuance: true,
          },
          where: {
            NOT: {
              deleted: true,
            },
            OR: {
              NOT: {
                id: 999999,
              },
            },
            issuedAt: {
              gte: start,
              lte: end,
            },
            name: { contains: input?.search?.name, mode: "insensitive" },
            number: { contains: input?.search?.number, mode: "insensitive" },
            typeId: input?.search?.typeId, // Added type filter
            actionTypeId: input?.search?.actionTypeId, // Added actionType filter
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.asset.count({
          where: {
            NOT: {
              deleted: true,
            },
            OR: {
              NOT: {
                id: 999999,
              },
            },
            issuedAt: {
              gte: start,
              lte: end,
            },
            name: { contains: input?.search?.name, mode: "insensitive" },
            number: { contains: input?.search?.number, mode: "insensitive" },
            typeId: input?.search?.typeId, // Added type filter
            actionTypeId: input?.search?.actionTypeId, // Added actionType filter
          },
        }),
        ctx.prisma.asset.count({
          where: {
            NOT: {
              deleted: true,
            },
            OR: {
              NOT: {
                id: 999999,
              },
            },

            name: { contains: input?.search?.name, mode: "insensitive" },
            number: { contains: input?.search?.number, mode: "insensitive" },
            typeId: input?.search?.typeId, // Added type filter
            actionTypeId: input?.search?.actionTypeId, // Added actionType filter
          },
        }),
      ])

      return {
        assets,
        count,
        allCount,
      }
    }),
  findAllNoLimit: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z
            .object({
              name: z.string().optional(),
              number: z.string().optional(),
              serial_no: z.string().optional(),
              barcode: z.string().optional(),
              description: z.string().optional(),
              remarks: z.string().optional(),
              invoiceNum: z.string().optional(),
              purchaseOrder: z.string().optional(),
              deployment_status: z.string().optional(),
              custodianId: z.number().optional(),
              departmentId: z.number().optional(),
              vendorId: z.number().optional(),
              subsidiaryId: z.number().optional(),
              assetProjectId: z.number().optional(),
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
            createdAt: "desc",
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
          where: {
            NOT: {
              id: 999999,
            },
            name: { contains: input?.search?.name, mode: "insensitive" },
            number: { contains: input?.search?.number, mode: "insensitive" },
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.asset.count({
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
      ])

      return {
        assets,
        count,
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
              number: z.string().optional(),
              serial_no: z.string().optional(),
              barcode: z.string().optional(),
              description: z.string().optional(),
              remarks: z.string().optional(),
              invoiceNum: z.string().optional(),
              purchaseOrder: z.string().optional(),
              deployment_status: z.string().optional(),
              custodianId: z.number().optional(),
              departmentId: z.number().optional(),
              vendorId: z.number().optional(),
              subsidiaryId: z.number().optional(),
              assetProjectId: z.number().optional(),
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
            createdAt: "desc",
          },
          include: {
            type: true, // Added type relation
            actionType: true, // Added actionType relation
            department: {
              include: {
                location: true,
                company: true,
                teams: true,
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
          where: {
            id: 999999,
          },
          skip: input?.page
            ? (input.page - 1) * (input.limit ?? 10)
            : undefined,
          take: input?.limit ?? 10,
        }),
        ctx.prisma.asset.count({
          where: {
            NOT: {
              deleted: true,
            },
          },
        }),
      ])

      return {
        assets,
        count,
      }
    }),
  checkDuplicates: authedProcedure
    .input(z.array(z.string()))
    .query(async ({ ctx, input }) => {
      if (input) {
        const assets = await ctx.prisma.asset.findMany({
          where: {
            number: {
              in: input,
            },
          },
          include: {
            type: true,
            actionType: true, // Added type relation
            custodian: true,
            department: {
              include: {
                location: true,
                company: true,
                teams: true,
              },
            },
            assetTag: true,
            parent: true,
            project: true,
            vendor: true,
            subsidiary: true,
            management: true,
            addedBy: true,
          },
        })
        return assets
      } else {
        return null
      }
    }),
  checkTableDuplicates: authedProcedure
    .input(z.array(z.string()))
    .query(async ({ ctx, input }) => {
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== null || input[i] !== undefined) {
          const assets = await ctx.prisma.asset.findMany({
            where: {
              number: {
                in: input,
              },
            },
            include: {
              // management: true,
              // model: true,
              type: true, // Added type relation
              actionType: true, // Added actionType relation
            },
          })
          return assets
        } else {
          return null
        }
      }
    }),

  findAllAssetForAssetCreate: authedProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.asset.count()

    return { count }
  }),
  create: authedProcedure
    .input(
      AssetCreateInput.extend({
        typeId: z.number(), // Add typeId to input validation
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { typeId, actionTypeId, ...rest } = input

      // Validate type exists if provided
      if (typeId) {
        const typeExists = await ctx.prisma.assetType.findUnique({
          where: { id: typeId },
        })
        if (!typeExists) {
          throw new Error("Specified asset type does not exist")
        }
      }

      // Generate asset number
      const allAssets = await ctx.prisma.asset.findMany()
      let assetNumber = ""

      for (let x = 0; x <= (allAssets?.length || 0) + 1; x++) {
        const formattedNumber = `GUN-${String(x + 1).padStart(4, "0")}`
        if (!allAssets?.some((item) => item.number === formattedNumber)) {
          assetNumber = formattedNumber
          break
        }
      }

      // Create asset with type relation
      const asset = await ctx.prisma.asset.create({
        data: {
          ...rest,
          number: assetNumber,
          status: "in",
          type: {
            connect: {
              id: typeId, // Connect to AssetType if typeId is provided
            },
          },
          actionType: {
            connect: {
              id: actionTypeId, // Connect to AssetType if typeId is provided
            },
          },
        },
        include: {
          type: true,
          actionType: true, // Include the type in the response
        },
      })

      if (asset) {
        // Creating an asset is automatically tagged as "in"
        const historyLog = await ctx.prisma.historyLogs.create({
          data: {
            gunNumber: asset.number ?? "",
            participant: ctx.session.user.name,
            action: "in",
          },
        })
      }

      return asset
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
  createOrUpdate: authedProcedure
    .input(AssetTransformInput)
    .mutation(async ({ ctx, input }) => {
      const { type, action_type, ...rest } = input

      // Validate type exists if provided
      let typeId
      let action_typeId
      if (type) {
        const typeExists = await ctx.prisma.assetType.findFirst({
          where: { name: type, deleted: false },
        })
        if (!typeExists) {
          const inner_type = await ctx.prisma.assetType.create({
            data: {
              name: type,
            },
          })
          typeId = inner_type.id
        } else [(typeId = typeExists.id)]
      }
      if (action_type) {
        const action_typeExists = await ctx.prisma.assetActionType.findFirst({
          where: { name: action_type, deleted: false },
        })
        if (!action_typeExists) {
          const inner_action_typeExists =
            await ctx.prisma.assetActionType.create({
              data: {
                name: action_type,
              },
            })
          action_typeId = inner_action_typeExists.id
        } else [(action_typeId = action_typeExists.id)]
      }

      const allAssets = await ctx.prisma.asset.findMany()
      let assetNumber = ""

      for (let x = 0; x <= (allAssets?.length || 0) + 1; x++) {
        const formattedNumber = `GUN-${String(x + 1).padStart(4, "0")}`
        if (!allAssets?.some((item) => item.number === formattedNumber)) {
          assetNumber = formattedNumber
          break
        }
      }
      // Create new asset
      const newAsset = await ctx.prisma.asset.create({
        data: {
          ...rest,
          number: assetNumber,
          status: "in",
          type: {
            connect: {
              id: typeId, // Connect to AssetType if typeId is provided
            },
          }, // Connect to AssetType
          actionType: {
            connect: {
              id: action_typeId, // Connect to AssetType if typeId is provided
            },
          }, // Connect to AssetType
        },
        //     ViewerList: {
        // connect: {
        //   id: viewerId, // 👈 add the current user as initial viewer
        // },
        include: {
          type: true,
        },
      })

      const historyLog = await ctx.prisma.historyLogs.create({
        data: {
          gunNumber: newAsset.number ?? "",
          participant: ctx.session.user.name,
          action: "in",
        },
      })
      return newAsset
    }),

  // await ctx.prisma.asset.upsert({
  //   where: {
  //     id: id,
  //   },
  //   create: {
  //     ...rest,
  //     // modelId: rest?.modelId ?? 0,
  //     vendorId: rest.vendorId ?? 0,
  //     management: { create: management },
  //     model: {
  //       connectOrCreate: {
  //         where: { id: model.id },
  //         create: {

  //         },
  //       },
  //     },
  //   },

  //   // update: {
  //   //   ...rest,
  //   //   modelId: rest.modelId ?? 0,
  //   //   vendorId: rest.vendorId ?? 0,
  //   //   management: { update: management },
  //   //   model: {
  //   //     update: model

  //   //   },
  //   // },
  // })

  edit: authedProcedure
    .input(AssetEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, type, action_type, ...rest } = input
      try {
        let typeId
        let action_typeId
        if (type) {
          const typeExists = await ctx.prisma.assetType.findFirst({
            where: { name: type, deleted: false },
          })
          if (!typeExists) {
            const inner_type = await ctx.prisma.assetType.create({
              data: {
                name: type,
              },
            })
            typeId = inner_type.id
          } else [(typeId = typeExists.id)]
        }
        if (action_type) {
          const action_typeExists = await ctx.prisma.assetActionType.findFirst({
            where: { name: type, deleted: false },
          })
          if (!action_typeExists) {
            const inner_action_typeExists =
              await ctx.prisma.assetActionType.create({
                data: {
                  name: action_type,
                },
              })
            action_typeId = inner_action_typeExists.id
          } else [(action_typeId = action_typeExists.id)]
        }

        await ctx.prisma.asset.update({
          where: {
            id,
          },
          data: {
            ...rest,
            type: {
              connect: {
                id: typeId, // Connect to AssetType if typeId is provided
              },
            }, // Connect to AssetType
            actionType: {
              connect: {
                id: action_typeId, // Connect to AssetType if typeId is provided
              },
            },
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
  update: authedProcedure
    .input(AssetUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        // management,
        // custodianId,
        // departmentId,
        // model,
        // vendorId,
        // subsidiaryId,
        // assetProjectId,
        // parentId,
        // assetTagId,
        // AssetIssuance,
        // purchaseOrder,
        // invoiceNum,
        // deployment_status,
        typeId,
        actionTypeId,
        ...rest
      } = input
      try {
        await ctx.prisma.asset.update({
          where: {
            id,
          },
          data: {
            ...rest,
            // model: {
            //   update: model,
            // },
            // management: {
            //   update: management,
            // },
            // AssetIssuance: {
            //   update: AssetIssuance,
            // },
            // vendor: {
            //   connect: {
            //     id: vendorId ?? 0,
            //   },
            // },
            // custodian: {
            //   connect: {
            //     id: custodianId ?? 0,
            //   },
            // },
            // department: {
            //   connect: {
            //     id: departmentId ?? 0,
            //   },
            // },
            // subsidiary: {
            //   connect: {
            //     id: subsidiaryId ?? 0,
            //   },
            // },
            // project: {
            //   connect: {
            //     id: assetProjectId ?? 0,
            //   },
            // },
            // parent: {
            //   connect: {
            //     id: parentId ?? 0,
            //   },
            // },
            // assetTag: {
            //   connect: {
            //     id: assetTagId ?? 0,
            //   },
            // },
            type: {
              connect: {
                id: typeId, // Connect to AssetType if typeId is provided
              },
            }, // Connect to AssetType
            actionType: {
              connect: {
                id: actionTypeId, // Connect to AssetType if typeId is provided
              },
            },
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
  changeStatus: authedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input
      try {
        const updatedAsset = await ctx.prisma.asset.update({
          where: {
            id,
          },
          data: {
            issuedAt: status === "issued" ? new Date() : null,
            status: status,
          },
        })

        if (updatedAsset) {
          // Create history log with status as action
          const historyLog = await ctx.prisma.historyLogs.create({
            data: {
              gunNumber: updatedAsset.number ?? "",
              participant: ctx.session.user.name,
              action: status,
            },
          })
        }

        return "Asset updated successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  changeStatusScanned: authedProcedure
    .input(
      z.object({
        id: z.number(),
        serial_no: z.string().nullish().optional(),
        status: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, serial_no, status } = input
      try {
        const updatedAsset = await ctx.prisma.asset.update({
          where: {
            id,
          },
          data: {
            issuedAt: status === "issued" ? new Date() : null,
            status: status,
          },
        })

        if (updatedAsset) {
          // Create history log with status as action
          const historyLog = await ctx.prisma.historyLogs.create({
            data: {
              gunNumber: updatedAsset.number ?? "",
              participant: ctx.session.user.name,
              action: status,
            },
          })
        }

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
      await ctx.prisma.asset.update({
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
  //       await ctx.prisma.asset.update({
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

  updateViewerList: authedProcedure
    .input(z.object({ assetId: z.number(), userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { assetId, userId } = input
      try {
        await ctx.prisma.asset.update({
          where: {
            id: assetId,
          },
          data: {
            ViewerList: { connect: { id: userId } },
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
})
