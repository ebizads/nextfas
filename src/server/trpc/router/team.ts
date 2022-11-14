import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { TeamCreateInput } from "../../schemas/team"
import { authedProcedure, t } from "../trpc"

export const teamRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const team = await ctx.prisma.team.findUnique({
      where: { id: input },
      include: {
        department: true,
        members: true,
      },
    })
    return team
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
        const [teams, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.team.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                department: true,
              },
              skip: input?.page ? input.page * (input.limit ?? 10) : 0,
              take: input?.limit ? input.limit : 10,
              where: {
                name: {
                  contains: input?.search?.name ? input.search.name : undefined,
                },
              },
            }),
            ctx.prisma.team.count(),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )
        return {
          teams,
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
    .input(TeamCreateInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.create({
          data: {
            name: input.name,
            departmentId: input.departmentId,
          },
        })
        return team
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
