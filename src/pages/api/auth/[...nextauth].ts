import NextAuth, { type NextAuthOptions } from "next-auth"

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../server/db/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { env } from "../../../env/server.mjs"
import dayjs from "dayjs"

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            username: credentials?.username,
          },
        })

        if (Boolean(user?.lockedUntil)) {
          throw new Error(
            `This user is currently locked until ${dayjs(
              user?.lockedUntil
            )}. Please contact administrator.`
          )
        }

        if (user !== null) {
          const isValid = bcrypt.compareSync(
            credentials?.password ?? "",
            user.password
          )

          if (isValid) {
            await prisma.user.update({
              where: {
                username: credentials?.username,
              },
              data: { attempts: 0 },
            })
            return user
          }
          let data = {}
          if (user.attempts < 4) {
            // checks if user has remaining attempts
            data = { attempts: (user.attempts += 1) }
          } else {
            // locks user if user reached 5 attempts
            const lock_date = dayjs().add(60, "day").toDate()
            // console.log(lock_date)
            data = {
              lockedUntil: lock_date,
              lockedReason: "Too many attempts, Account is locked",
              lockedAt: new Date(),
            }
          }

          await prisma.user.update({
            where: {
              username: credentials?.username,
            },
            data,
          })
          throw new Error("Incorrect password. Please try again.")
        }
        throw new Error("Account not found. Please try again.")
      },
    }),
  ],
}

export default NextAuth(authOptions)
