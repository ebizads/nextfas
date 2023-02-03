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
import { passArrayCheck } from "../../../lib/functions.js"
import { error } from "console"

export const userRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
    })
  }),
  findAll: authedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({})
  }),
  create: authedProcedure
    .input(CreateUserInput)
    .mutation(async ({ input, ctx }) => {
      const { address, profile, password, name, ...rest } = input
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
            oldPassword: {
              set: encryptedPassword ?? "",
            },
            name: name,
            password: encryptedPassword,
            email: username + env.NEXT_PUBLIC_CLIENT_EMAIL,
            username,
            profile: {
              create: profile ?? undefined,
            },
            address: {
              create: address,
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
  update: authedProcedure
    .input(EditUserInput)
    .mutation(async ({ input, ctx }) => {
      const { address, id, profile, oldPassword, passwordAge, ...rest } = input
      return await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...rest,
          oldPassword: {
            set: oldPassword ?? undefined,
          },
          address: {
            create: address ?? undefined,
          },
          profile: {
            update: profile ?? undefined,
          },
          passwordAge: passwordAge,
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
      const { password, passwordAge, id, oldPassword, ...rest } = input
      const encryptedPassword = await bcrypt.hash(password, 10)
      if (oldPassword.includes(encryptedPassword)) {
        return await ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            ...rest,
            oldPassword: {
              set: encryptedPassword ?? "",
            },
            password: encryptedPassword,
            passwordAge: passwordAge,
          },
        })
      } else {
        console.log("ugh")
      }
    }),
})
