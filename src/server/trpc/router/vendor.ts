import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { VendorCreateInput, VendorDelete, VendorEditInput } from "../../schemas/vendor"
import { authedProcedure, t } from "../trpc"

export const vendorRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const vendor = await ctx.prisma.vendor.findUnique({
      where: { id: input },
      include: {
        address: true,
      },
    })
    return vendor
  }),
  createOrUpdate: authedProcedure
    .input(VendorEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, address, ...rest } = input
      try {
        await ctx.prisma.employee.upsert({
          where: {
            id: id,
          },
          create: {
            ...rest,
            address: {
              connectOrCreate: {
                where: {
                  id: 0,
                },
                create: address,
              },
            },
          },
          update: {
            ...rest,
            address: { update: address },
          },
        })
      } catch (error) { }
    }),
  checkDuplicates: authedProcedure
    .input(z.array(z.number()))
    .query(async ({ ctx, input }) => {
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== null || input[i] !== undefined) {
          const vendors = await ctx.prisma.vendor.findMany({
            where: {
              id: {
                in: input,
              },
            },
            include: {
              address: true,
            },
          })
          return vendors
        } else {
          return null
        }
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
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const [vendors, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.vendor.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                address: true,
              },
              skip: input?.page
                ? (input.page - 1) * (input.limit ?? 10)
                : undefined,
              take: input?.limit ?? 10,
              where: {
                name: {
                  contains: input?.search?.name ? input.search.name : undefined,
                  mode: 'insensitive'
                },
                NOT: {
                  deleted: true,
                },
              },
            }),
            ctx.prisma.vendor.count({
              where: {
                NOT: {
                  deleted: true,
                },
              },
            }),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )
        return {
          vendors,
          count,
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
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
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const [vendors, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.vendor.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                address: true,
              },
              where: {
                name: {
                  contains: input?.search?.name ? input.search.name : undefined,
                  mode: 'insensitive'
                },

                id: 999999,

              },
              skip: input?.page
                ? (input.page - 1) * (input.limit ?? 10)
                : undefined,
              take: input?.limit ?? 10,

            }),
            ctx.prisma.vendor.count({
              where: {
                NOT: {
                  deleted: true,
                },
              },
            }),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )
        return {
          vendors,
          count,
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  create: authedProcedure
    .input(VendorCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { address, ...rest } = input

      const vendor = await ctx.prisma.vendor.create({
        data: {
          ...rest,
          address: {
            connectOrCreate: {
              where: {
                id: 0,
              },
              create: address,
            },
          },
        },
      })
      return vendor
    }),
  edit: authedProcedure
    .input(VendorEditInput)
    .mutation(async ({ ctx, input }) => {
      const { address, id, ...rest } = input

      try {
        await ctx.prisma.vendor.update({
          where: {
            id,
          },
          data: {
            ...rest,
            address: {
              update: address,
            },
          },
        })

        return "Vendor edited successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),

  delete: authedProcedure
    .input(VendorDelete)
    .mutation(async ({ ctx, input }) => {
      const { id } = input

      try {
        await ctx.prisma.vendor.update({
          where: {
            id,
          },
          data: {
            deleted: true,
            deletedAt: new Date(),
          },
        })

        return "Vendor edited successfully"
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
        await ctx.prisma.vendor.updateMany({
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

        return "Vendor deleted successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
