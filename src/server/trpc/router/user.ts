import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { env } from "../../../env/client.mjs"
import {
  ChangeUserPass,
  CreateUserInput,
  EditUserInput,
} from "../../schemas/user"
import { authedProcedure, t } from "../trpc"
import bcrypt from "bcrypt"
import { Prisma } from "@prisma/client"
import { error } from "console"

export const userRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      include: {
        address: true,
        profile: true,
        validateTable: true,
        Userteam: {
          include: {
            department: {
              include: {
                location: true
              }
            }
          }
        }

      },
    })

    return user
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
              user_id: z.string().optional(),
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
        const [user, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.user.findMany({
              orderBy: {
                createdAt: "desc",
              },
              include: {
                address: true,
                profile: true,
                validateTable: true,
                Userteam: {
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
                // name: { contains: input?.search?.name },
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
            ctx.prisma.user.count({
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
          user,
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
  findValidate: authedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const validate = await ctx.prisma.validateTable.findUnique({
        where: {
          userId: input,
        },
      })
      return validate
    }),
  create: authedProcedure
    .input(CreateUserInput)
    .mutation(async ({ input, ctx }) => {
      const { address, profile, password, validateTable, name, ...rest } = input
      let username = (profile.first_name[0] + profile.last_name)
        .replace(" ", "")
        .toLowerCase()

      const encryptedPassword = await bcrypt.hash(password, 10)

      try {
        const user = await ctx.prisma.user.findMany({
          where: {
            username: {
              contains: username,
            },
          },
        })

        if (user.length !== 0) {
          username = username + user.length
        }
        await ctx.prisma.user.create({
          data: {
            ...rest,
            validateTable: {
              create: validateTable ?? undefined,
            },
            address: {
              create: address ?? undefined,
            },
            profile: {
              create: profile ?? undefined,
            },
            oldPassword: {
              set: encryptedPassword ?? "",
            },
            name: name,
            password: encryptedPassword,
            email: username + env.NEXT_PUBLIC_CLIENT_EMAIL,
            username,
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
  update: authedProcedure
    .input(EditUserInput)
    .mutation(async ({ input, ctx }) => {
      const { address, id, profile, validateTable, ...rest } = input
      try {
        await ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            ...rest,
            validateTable: {
              update: validateTable ?? undefined,
            },
            address: {
              update: address ?? undefined,
            },
            profile: {
              update: profile ?? undefined,
            },
          },
        })
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.user.update({
      where: {
        id: input,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    })
  }),
  deleteMany: authedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.updateMany({
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
  change: authedProcedure
    .input(ChangeUserPass)
    .mutation(async ({ input, ctx }) => {
      const { password, id, oldPassword, ...rest } = input

      const encryptedPassword = await bcrypt.hash(password, 10)

      // // const user = await ctx.prisma.user.findMany({ where: { id: id } })
      // // const updatedArray = [encryptedPassword, user.find(oldPassword)]

      // for (const arrays of oldPassword) {
      //   const match = await bcrypt.compare(password, arrays)
      //   if (!match) {
      //     flag = true
      //   }
      // }
      const sample: string[] = [...oldPassword]
      for (let i = 0; i < sample.length; i++) {
        const match = await bcrypt.compare(password, `${sample[i]}`)
        if (match) {
          return false
        }
      }

      if (sample.length >= 12) {
        sample.pop()
      }

      return await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          oldPassword: {
            set: [encryptedPassword, ...sample],
          },
          password: encryptedPassword,
          ...rest,
        },
      })
    }),
})
