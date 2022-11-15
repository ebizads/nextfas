import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { authedProcedure, t } from "../trpc"
import { EmployeeCreateInput, EmployeeEditInput } from "../../schemas/employee"

export const employeeRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const employee = await ctx.prisma.employee.findUnique({
      where: { id: input },
      include: {
        address: true,
        profile: true,
        team: {
          include: {
            supervisors: true,
            department: {
              include: {
                location: true,
              },
              select: {
                name: true,
              },
            },
          },
          select: {
            name: true,
          },
        },
        supervisee: true,
      },
    })
    return employee
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
              employee_id: z.string().optional(),
              email: z.string().optional(),
            })
            .optional(),
          filter: z
            .object({
              hired_date: z.date().optional(),
              subsidiary: z.string().optional(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const [employees, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.employee.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                address: true,
                profile: true,
                team: {
                  include: {
                    supervisors: true,
                    department: {
                      include: {
                        location: true,
                      },
                    },
                  },
                },
                supervisee: true,
              },
              where: {
                NOT: {
                  deleted: true,
                },
                hired_date: input?.filter?.hired_date,
                name: { contains: input?.search?.name },
                employee_id: { contains: input?.search?.employee_id },
                email: { contains: input?.search?.email },
              },
              skip: input?.page
                ? (input.page - 1) * (input.limit ?? 10)
                : undefined,
              take: input?.limit ?? 10,
            }),
            ctx.prisma.employee.count({
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
          employees,
          pages: Math.ceil(count / (input?.limit ?? 0)),
          total: count,
        }
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  checkDuplicates: authedProcedure
    .input(z.array(z.number()))
    .query(async ({ ctx, input }) => {
      const employees = await ctx.prisma.employee.findMany({
        where: {
          id: {
            in: input,
          },
        },
      })
      return employees
    }),
  create: authedProcedure
    .input(EmployeeCreateInput)
    .mutation(async ({ ctx, input }) => {
      const {
        address,
        profile,
        supervisee,
        team,
        teamId,
        superviseeId,
        ...rest
      } = input

      try {
        await ctx.prisma.employee.create({
          data: {
            ...rest,
            profile: {
              connectOrCreate: {
                where: {
                  id: undefined,
                },
                create: profile,
              },
            },
            address: {
              connectOrCreate: {
                where: {
                  id: undefined,
                },
                create: address,
              },
            },
            supervisee: {
              connectOrCreate: {
                where: {
                  id: superviseeId,
                },
                create: {
                  name: supervisee?.name ?? "",
                },
              },
            },
            team: {
              connectOrCreate: {
                where: {
                  id: teamId,
                },
                create: {
                  name: team?.name ?? "",
                },
              },
            },
          },
        })

        return "User created successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  createMany: authedProcedure
    .input(z.array(EmployeeCreateInput))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.employee.createMany({
        data: input.map((employee) => {
          const {
            address,
            profile,
            supervisee,
            team,
            teamId,
            superviseeId,
            ...rest
          } = employee

          return {
            ...rest,
            profile: {
              connectOrCreate: {
                where: {
                  id: undefined,
                },
                create: profile,
              },
            },
            address: {
              connectOrCreate: {
                where: {
                  id: undefined,
                },
                create: address,
              },
            },
            supervisee: {
              connectOrCreate: {
                where: {
                  id: superviseeId,
                },
                create: {
                  name: supervisee?.name ?? "",
                },
              },
            },
            team: {
              connectOrCreate: {
                where: {
                  id: teamId,
                },
                create: {
                  name: team?.name ?? "",
                },
              },
            },
          }
        }),
        skipDuplicates: true,
      })
      return "Employees successfully created"
    }),
  edit: authedProcedure
    .input(EmployeeEditInput)
    .mutation(async ({ ctx, input }) => {
      const {
        address,
        profile,
        supervisee,
        team,
        teamId,
        superviseeId,
        id,
        ...rest
      } = input

      try {
        await ctx.prisma.employee.update({
          where: {
            id,
          },
          data: {
            ...rest,
            profile: {
              update: profile,
            },
            address: {
              update: address,
            },
            supervisee: {
              connectOrCreate: {
                where: {
                  id: superviseeId,
                },
                create: {
                  name: supervisee?.name ?? "",
                },
              },
            },
            team: {
              connectOrCreate: {
                where: {
                  id: teamId,
                },
                create: {
                  name: team?.name ?? "",
                },
              },
            },
          },
        })

        return "User created successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.employee.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      })

      return "User deleted successfully"
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
        await ctx.prisma.employee.updateMany({
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

        return "User deleted successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
