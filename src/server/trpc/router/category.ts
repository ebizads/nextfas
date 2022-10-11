import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
  CategoryCreateInput,
  CategoryEditInput,
} from "../../common/input-types"
import { authedProcedure, t } from "../trpc"

export const categoryRouter = t.router({
  findAll: authedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany()
    return categories
  }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const category = await ctx.prisma.category.findUnique({
      where: {
        id: input,
      },
    })
    return category
  }),
  create: authedProcedure
    .input(CategoryCreateInput)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.category.create({
          data: input,
        })
        return "Category successfully created"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  edit: authedProcedure
    .input(CategoryEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      try {
        await ctx.prisma.category.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        })
        return "Category successfully edited"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.category.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      })
      return "Category successfully deleted"
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: JSON.stringify(error),
      })
    }
  }),
})
