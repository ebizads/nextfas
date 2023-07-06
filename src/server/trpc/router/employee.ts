import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { authedProcedure, t } from "../trpc"
import { EmployeeCreateInput, EmployeeDeleteInput, EmployeeEditInput, EmployeeTableEditInput } from "../../schemas/employee"
import { create, map } from "lodash"
import { useState } from "react"
import moment from "moment"
import { env } from "../../../env/client.mjs"

export const employeeRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const employee = await ctx.prisma.employee.findUnique({
      where: { id: input },
      include: {
        address: true,
        profile: true,
        team: {
          include: {
            department: {
              include: {
                location: true,
              },
              // select: {
              //   name: true,
              // },
            },
          },
          // select: {
          //   name: true,
          // },
        },
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
              team: z
                .object({
                  name: z.string().optional(),
                  department: z
                    .object({
                      id: z.number(),
                    })
                    .optional(),
                })
                .optional(),
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
                    department: {
                      include: {
                        location: true,
                      },
                    },
                  },
                },
              },
              where: {
                NOT: {
                  deleted: true,
                },
                // hired_date: input?.filter?.hired_date,
                name: { contains: input?.search?.name, mode: 'insensitive' },
                employee_id: { contains: input?.search?.employee_id },
                // email: { contains: input?.search?.email },
                // team: {
                //   department: {
                //     id: {
                //       equals: input?.search?.team?.department?.id,
                //     },
                //   },
                // },
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

  findAllSample: authedProcedure
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
              team: z
                .object({
                  name: z.string().optional(),
                  department: z
                    .object({
                      id: z.number(),
                    })
                    .optional(),
                })
                .optional(),
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
                    department: {
                      include: {
                        location: true,
                      },
                    },
                  },
                },
              },
              where: {
                id: 999999,
                // hired_date: input?.filter?.hired_date,
                name: { contains: input?.search?.name, mode: 'insensitive' },
                // employee_id: { contains: input?.search?.employee_id },
                // email: { contains: input?.search?.email },
                // team: {
                //   department: {
                //     id: {
                //       equals: input?.search?.team?.department?.id,
                //     },
                //   },
                // },
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
      3
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== null || input[i] !== undefined) {
          const employees = await ctx.prisma.employee.findMany({
            where: {
              id: {
                in: input,
              },
            },
            include: {
              address: true,
              profile: true,
              team: {
                include: {
                  department: {
                    include: {
                      location: true,
                    },
                  },
                },
              },
            },
          })
          return employees
        } else {
          return null
        }
      }
    }),
  create: authedProcedure
    .input(EmployeeCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { address, profile, ...rest } = input

      try {
        await ctx.prisma.employee.create({
          data: {
            ...rest,
            profile: {
              create: profile ?? undefined,
            },
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

        return "User created successfully"
      } catch (error) {
        console.log(error)
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
          const { address, profile, ...rest } = employee

          return {
            ...rest,
            profile: {
              connectOrCreate: {
                where: {
                  id: 0,
                },
                create: profile,
              },
            },
            address: {
              connectOrCreate: {
                where: {
                  id: 0,
                },
                create: address,
              },
            },
          }
        }),
        skipDuplicates: true,
      })
      return "Employees successfully created"
    }),

  createOrUpdate: authedProcedure
    .input(EmployeeTableEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, address, profile, ...rest } = input
      const empId = moment().format("YY-MDhms")


      await ctx.prisma.employee.upsert({
        where: {
          id: id,
        },
        create: {
          ...rest,
          employee_id: env.NEXT_PUBLIC_CLIENT_EMPLOYEE_ID + empId,
          address: { create: address },
          profile: { create: profile },
        },
        update: {
          ...rest,
          address: { update: address },
          profile: { update: profile },
        },
      })
      return (profile)

    }),
  edit: authedProcedure
    .input(EmployeeEditInput)
    .mutation(async ({ ctx, input }) => {
      const { address, profile, id, ...rest } = input
      const duplicate = await ctx.prisma.employee.findMany({
        where: {
          id: id,
        },
        include: {
          address: true,
          profile: true,
          team: {
            include: {
              department: {
                include: {
                  location: true,
                },
              },
            },
          },
        },
      })

      try {
        if (duplicate) {
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
            },
          })

          return "User created successfully"
        } else {
          // await ctx.prisma.employee.create({
          //   data: {
          //     ...rest,
          //     profile: {
          //       create: profile ?? undefined,
          //     },
          //     address: {
          //       connectOrCreate: {
          //         where: {
          //           id: 0,
          //         },
          //         create: address,
          //       },
          //     },
          //   },
          // })
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  delete: authedProcedure.input(EmployeeDeleteInput)
    .mutation(async ({ ctx, input }) => {
      const { id } = input
      try {
        await ctx.prisma.employee.update({
          where: {
            id: id,
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
