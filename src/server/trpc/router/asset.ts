import { z } from "zod"
import {
  AssetCreateInput,
  AssetEditInput,
  AssetTransformInput,
  AssetUpdateInput,
} from "../../schemas/asset"
import { TRPCError } from "@trpc/server"
import { authedProcedure, t } from "../trpc"
import { VendorEditInput } from "../../schemas/model"
import { type } from "os"

export const assetRouter = t.router({
  findOne: authedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const asset = await ctx.prisma.asset.findUnique({
      where: {
        number: input,
      },
      include: {
        custodian: true,
        parent: true,
        project: true,
        vendor: true,
        subsidiary: true,
        management: true,
        addedBy: true,
        model: {
          include: {
            type: true,
            category: true,
            class: true,
          },
        },
        department: {
          include: {
            location: true,
            company: true,
            teams: true,
          },
        },

      },
    })
    return asset
  }),
  findOneTable: authedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const asset = await ctx.prisma.asset.findUnique({
      where: {
        number: input,
      },
      include: {
        management: true,
        model: true,
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
            model: {
              include: {
                class: true,
                category: true,
                type: true,
              },
            },
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
          },
          where: {
            NOT: {
              deleted: true,
            },
            OR: {
              NOT: {
                id: 999999,
              }
            },
            name: { contains: input?.search?.name, mode: 'insensitive' },
            number: { contains: input?.search?.number, mode: 'insensitive' },
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
            model: {
              include: {
                class: true,
                category: true,
                type: true,
              },
            },
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
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== null || input[i] !== undefined) {
          const assets = await ctx.prisma.asset.findMany({
            where: {
              number: {
                in: input
              },
            },
            include: {
              model: {
                include: {
                  type: true,
                  category: true,
                  class: true,
                },
              },
              custodian: true,
              department: {
                include: {
                  location: true,
                  company: true,
                  teams: true,
                },
              },

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
                in: input
              },
            },
            include: {
              management: true,
              model: true,
            },
          })
          return assets
        } else {
          return null
        }
      }
    }),
  create: authedProcedure
    .input(AssetCreateInput)
    .mutation(async ({ ctx, input }) => {
      const {
        management,
        custodianId,
        departmentId,
        model,
        vendorId,
        subsidiaryId,
        assetProjectId,
        parentId,
        addedById,
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
              id: custodianId ?? 0,
            },
          },
          department: {
            connect: {
              id: departmentId ?? 0,
            },
          },
          vendor: {
            connect: {
              id: vendorId ?? 0,
            },
          },
          subsidiary: {
            connect: {
              id: subsidiaryId ?? 0,
            },
          },
          project: {
            connect: {
              id: assetProjectId ?? 0,
            },
          },
          parent: {
            connect: {
              id: parentId ?? 0,
            },
          },
          addedBy: {
            connect: {
              id: addedById ?? 0,
            },
          },
        },
        include: {
          model: true,
          custodian: true,
          subsidiary: true,
          project: true,
          parent: true,
          department: true,
          vendor: true,
          management: true,
          addedBy: true,
        },
      })
      return asset
    }),
  createMany: authedProcedure
    .input(z.array(AssetCreateInput))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.asset.createMany({
        data: input.map((asset) => {
          const {
            management,
            custodianId,
            departmentId,
            model,
            vendorId,
            subsidiaryId,
            assetProjectId,
            parentId,
            addedById,
            ...rest
          } = asset
          return {
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
                id: custodianId ?? 0,
              },
            },
            department: {
              connect: {
                id: departmentId ?? 0,
              },
            },
            vendor: {
              connect: {
                id: vendorId ?? 0,
              },
            },
            subsidiary: {
              connect: {
                id: subsidiaryId ?? 0,
              },
            },
            project: {
              connect: {
                id: assetProjectId ?? 0,
              },
            },
            parent: {
              connect: {
                id: parentId ?? 0,
              },
            },
          }
        }),
        skipDuplicates: true,
      })
      return "Assets successfully created"
    }),
  createOrUpdate: authedProcedure
    .input(AssetTransformInput)
    .mutation(async ({ ctx, input }) => {
      const { management, model, number, id, ...rest } = input
      console.log("MODEL:", model)

      const existAssets = await ctx.prisma?.asset.findFirst({
        where: {
          number: number
        }
      })

      let modelId = null

      if (model.id) {
        const existModel = await ctx.prisma?.model.findFirst({
          where: { id: model.id ?? 0 },
        })
        if (existModel?.id) {
          // return { pumasok: existModel?.id }
          await ctx.prisma?.model.update({
            where: {
              id: model.id
            }, data: {
              ...model
            }
          })
          modelId = existModel?.id
        } else {
          // return { indiPumasok: existModel?.id }
          const newModel = await ctx.prisma?.model.create({
            data: {
              ...model
            }
          })
          modelId = newModel.id
        }
      }


      if (existAssets?.id) {
        await ctx.prisma?.asset.update({
          where: {
            number: number
          },
          data: {
            ...rest,
            number: number,
            vendorId: rest.vendorId ?? 0,
            management: { update: management },
            modelId: modelId,
          }
        })
      } else {
        await ctx.prisma?.asset.create({
          data: {
            ...rest,
            number: number,
            vendorId: rest.vendorId ?? 0,
            management: {
              connectOrCreate: {
                where: {
                  id: 0,
                },
                create: management,
              },
            },
            modelId: modelId,
          }
        })
      }

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
    }),
  edit: authedProcedure
    .input(AssetEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, management, ...rest } = input
      try {
        await ctx.prisma.asset.update({
          where: {
            id,
          },
          data: {
            ...rest,
            management: {
              update: management,
            }
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
        management,
        custodianId,
        departmentId,
        model,
        vendorId,
        subsidiaryId,
        assetProjectId,
        parentId,
        purchaseOrder,
        invoiceNum,
        deployment_status,
        ...rest
      } = input
      try {
        await ctx.prisma.asset.update({
          where: {
            id,
          },
          data: {
            ...rest,
            model: {
              update: model,
            },
            management: {
              update: management,
            },
            vendor: {
              connect: {
                id: vendorId ?? 0,
              },
            },
            custodian: {
              connect: {
                id: custodianId ?? 0,
              },
            },
            department: {
              connect: {
                id: departmentId ?? 0,
              },
            },
            subsidiary: {
              connect: {
                id: subsidiaryId ?? 0,
              },
            },
            project: {
              connect: {
                id: assetProjectId ?? 0,
              },
            },
            parent: {
              connect: {
                id: parentId ?? 0,
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
