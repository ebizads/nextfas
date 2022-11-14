import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { CompanyCreateInput } from "../../schemas/company"
import { authedProcedure, t } from "../trpc"

export const companyRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const company = await ctx.prisma.company.findUnique({
      where: { id: input },
      include: {
        subsidiaries: true,
        address: true,
        departments: {
          select: {
            name: true,
          },
          include: {
            teams: true,
          },
        },
      },
    })
    return company
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
        const [companies, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.company.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                address: true,
              },
              skip: input?.page ? input.page * (input.limit ?? 10) : 0,
              take: input?.limit ? input.limit : 10,
              where: {
                name: {
                  contains: input?.search?.name ? input.search.name : undefined,
                },
              },
            }),
            ctx.prisma.company.count(),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )
        return {
          companies,
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
    .input(CompanyCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { address, ...rest } = input

      const company = await ctx.prisma.company.create({
        data: {
          ...rest,
          address: {
            connectOrCreate: {
              where: {
                id: undefined,
              },
              create: address,
            },
          },
        },
      })
      return company
    }),
})
