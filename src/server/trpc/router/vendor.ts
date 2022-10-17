import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { VendorCreateInput, VendorEditInput } from "../../common/schemas/vendor"
import { authedProcedure, t } from "../trpc"

export const vendorRouter = t.router({
  findAll: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const [vendors, vendorsCount] = await ctx.prisma.$transaction(
        [
          ctx.prisma.vendor.findMany({
            orderBy: {
              createdAt: "desc",
            },
            where: {
              NOT: {
                deleted: true,
              },
              name: { contains: input?.search },
              type: { contains: input?.search },
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
      return { vendors, pages: Math.ceil(vendorsCount / (input?.limit ?? 10)) }
    }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const vendor = await ctx.prisma.vendor.findUnique({
      where: {
        id: input,
      },
      include: {
        address: true,
      },
    })
    return vendor
  }),
  create: authedProcedure
    .input(VendorCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { address, ...rest } = input

      try {
        await ctx.prisma.vendor.create({
          data: {
            ...rest,
            address: {
              create: address ?? undefined,
            },
          },
        })
        return "Vendor successfully created"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  edit: authedProcedure
    .input(VendorEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, address, ...rest } = input

      try {
        await ctx.prisma.vendor.update({
          where: {
            id,
          },
          data: {
            ...rest,
            address: {
              update: address ?? undefined,
            },
          },
        })
        return "Vendor successfully edited"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.vendor.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      })
      return "Vendor successfully deleted"
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
        return "Vendors successfully deleted"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
