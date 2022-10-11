import { TRPCError } from "@trpc/server"
import { t } from "../trpc"
import bcrypt from "bcrypt"
import { RegisterUserInput } from "../../common/input-types"
import { env } from "../../../env/client.mjs"

export const authRouter = t.router({
  getSession: t.procedure.query(({ ctx }) => ctx.session),
  register: t.procedure
    .input(RegisterUserInput)
    .mutation(async ({ input, ctx }) => {
      const { address, profile, password, ...rest } = input
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

        console.log(username)

        await ctx.prisma.user.create({
          data: {
            ...rest,
            password: encryptedPassword,
            email: username + env.NEXT_PUBLIC_CLIENT_EMAIL,
            username,
            profile: {
              create: profile ?? undefined,
            },
            address: {
              create: address ?? undefined,
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
})
