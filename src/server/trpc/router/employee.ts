import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
  EmployeeCreateInput,
  EmployeeEditInput,
} from "../../common/schemas/employee"
import { authedProcedure, t } from "../trpc"

export const employeeRouter = t.router({
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
        const [employees, employeesCount] = await ctx.prisma.$transaction(
          [
            ctx.prisma.employee.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                address: true,
                profile: true,
              },
              where: {
                NOT: {
                  deleted: true,
                },
                hired_date: input?.filter?.hired_date,
                subsidiary: { contains: input?.filter?.subsidiary },
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
          pages: Math.ceil(employeesCount / (input?.limit ?? 10)),
          total: employeesCount,
        }
      } catch (error) {
        console.log(error)

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const employee = await ctx.prisma.employee.findUnique({
      where: {
        id: input,
      },
      include: {
        address: true,
        profile: true,
      },
    })
    return employee
  }),
  create: authedProcedure
    .input(EmployeeCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { profile, address, ...rest } = input

      try {
        await ctx.prisma.employee.create({
          data: {
            ...rest,
            profile: {
              create: profile ?? undefined,
            },
            address: {
              create: address ?? undefined,
            },
          },
        })
        return "Employee successfully created"
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
          id: { in: input },
        },
        include: {
          address: true,
          profile: true,
        },
      })
      return employees
    }),
  createMany: authedProcedure
    .input(z.array(EmployeeCreateInput))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.employee.createMany({
          data: input.map((employee) => {
            const { profile, address, ...rest } = employee

            return {
              ...rest,
              profile: {
                create: profile ?? undefined,
              },
              address: {
                create: address ?? undefined,
              },
            }
          }),
          skipDuplicates: true,
        })

        return "Employees successfully created"
      } catch (error) {
        console.log(error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  edit: authedProcedure
    .input(EmployeeEditInput)
    .mutation(async ({ ctx, input }) => {
      const { profile, address, id, ...rest } = input

      try {
        await ctx.prisma.employee.update({
          where: {
            id,
          },
          data: {
            ...rest,
            profile: { update: profile ?? undefined },
            address: { update: address ?? undefined },
          },
        })
        return "Employee successfully edited"
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
      return "Employee successfully deleted"
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
        return "Employees successfully deleted"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
