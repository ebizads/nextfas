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
import { error } from "console"

export const userRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      include:{
        address: true,
        profile: true,
        validateTable: true,
      }
    })

    return user
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
  findAll: authedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({})
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
      return await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...rest,
          validateTable: {
            create: validateTable ?? undefined,
          },
          address: {
            create: address ?? undefined,
          },
          profile: {
            update: profile ?? undefined,
          },
        },
      })
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
