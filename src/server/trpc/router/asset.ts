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
              status: "in",
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
              status: "issued",
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
              deleted: true,
            },
            OR: {
              NOT: {
                id: 999999,
              },
            },
            createdAt: {
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
            createdAt: {
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
            // Connect to AssetType if typeId is provided
          }, // Connect to AssetType
          actionType: {
            connect: {
              id: actionTypeId, // Connect to AssetType if typeId is provided
            },
            // Connect to AssetType if typeId is provided
          },
        },
        include: {
          type: true,
          actionType: true, // Include the type in the response
        },
      })

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
      const { number, type, action_type, ...rest } = input

      // Validate type exists if provided
      let typeId
      let action_typeId
      if (type) {
        const typeExists = await ctx.prisma.assetType.findUnique({
          where: { name: type },
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
        const action_typeExists = await ctx.prisma.assetActionType.findUnique({
          where: { name: action_type },
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

      const existAssets = await ctx.prisma.asset.findFirst({
        where: {
          number: number ?? "",
        },
      })

      if (existAssets?.id) {
        // Update existing asset
        const updatedAsset = await ctx.prisma.asset.update({
          where: { number: number },
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
            }, // Connect to AssetType
          },
          include: {
            type: true, // Include the type in the response
          },
        })
        return updatedAsset
      } else {
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
          include: {
            type: true,
          },
        })
        return newAsset
      }
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
          const typeExists = await ctx.prisma.assetType.findUnique({
            where: { name: type },
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
          const action_typeExists = await ctx.prisma.assetActionType.findUnique(
            {
              where: { name: type },
            }
          )
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
        await ctx.prisma.asset.update({
          where: {
            id,
          },
          data: {
            status: status,
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
  changeStatusScanned: authedProcedure
    .input(
      z.object({
        serial_no: z.string(),
        status: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { serial_no, status } = input
      try {
        await ctx.prisma.asset.updateMany({
          where: {
            serial_no,
          },
          data: {
            status: status,
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
})
