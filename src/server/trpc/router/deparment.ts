import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { DepartmentCreateInput } from "../../schemas/department"
import { authedProcedure, t } from "../trpc"

export const departmentRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const department = await ctx.prisma.department.findUnique({
      where: { id: input },
      include: {
        company: {
          include: {
            address: true,
          }
        },
        building: true,
        location: true,
        teams: true,
      },
    })
    return department
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
        const [departments, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.department.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                company: true,
                location: true,
                teams: {
                  include: {
                    department: true
                  }
                },
                building: true,


              },
              skip: input?.page ? input.page * (input.limit ?? 10) : 0,
              take: input?.limit ? input.limit : 10,
              where: {
                name: {
                  contains: input?.search?.name ? input.search.name : undefined,
                },
              },
            }),
            ctx.prisma.department.count(),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )
        return {
          departments,
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
    .input(DepartmentCreateInput)
    .mutation(async ({ ctx, input }) => {
      const department = await ctx.prisma.department.create({
        data: {
          name: input.name,
          company: {
            connectOrCreate: {
              where: {
                id: input.companyId ?? undefined,
              },
              create: { name: "" },
            },
          },
          building: {
            connectOrCreate: {
              where: {
                id: input.buildingId ?? undefined,
              },
              create: { name: "" },
            },
          },
          location: {
            connectOrCreate: {
              where: {
                id: input.locationId ?? undefined,
              },
              create:
                {
                  floor: input.location?.floor ?? "",
                  room: input.location?.room ?? "",
                } ?? undefined,
            },
          },
        },
      })
      return department
    }),
})
