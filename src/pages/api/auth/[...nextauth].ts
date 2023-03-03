import NextAuth, { type NextAuthOptions } from "next-auth"

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../server/db/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { env } from "../../../env/server.mjs"
import dayjs from "dayjs"
//import { passArrayCheck } from "../../../lib/functions"

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
        const value = null
        if (user !== null) {
          const dateNow = new Date()
          const hoursNow = dateNow.getHours()
          if (Boolean(user?.inactivityDate)) {
            const dateBetween = Number(
              (dateNow.getTime() - (user?.inactivityDate?.getTime() ?? 0)) /
                (1000 * 60 * 60 * 24)
            )
            console.log("Date: " + dateBetween)
            //throw new Error(dateBetween.toString())
            if (dateBetween > 30 && dateBetween < 60) {
              throw new Error(
                `This user is currently locked. Please contact administrator.`
              )
            } else if (dateBetween >= 60 && dateBetween < 90) {
              await prisma.user.update({
                where: {
                  username: credentials?.username,
                },
                data: {
                  deleted: true,
                },
              })
              throw new Error(
                `This user is deleted. Please contact administrator.`
              )
            } else if (dateBetween >= 90) {
              await prisma.userArchive.create({
                data: {
                  user_Id: user?.user_Id?? "",
                  position: user?.position ?? "",
                  teamId: user?.teamId ?? 0,
                  old_id: user?.id ?? 0,
                  name: user?.name ?? "",
                  email: user?.email ?? "",
                  username: user?.username ?? "",
                  hired_date: user?.hired_date,
                  user_type: user?.user_type ?? ""
                  
                },
              }),
              await prisma.user.delete({
                where: {
                  id: user?.id
                }
              })
              throw new Error(
                `This user is deleted in the database. Please contact administrator.`
              )
            }
          }
          if (Boolean(user.lockedUntil)) {
            if (dateNow.getDate() <= (user.lockedUntil?.getDate() ?? 0)) {
              if (dateNow.getHours() <= (user.lockedUntil?.getHours() ?? 0)) {
                if (Number(user.lockedUntil?.getHours()) > Number(hoursNow)) {
                  throw new Error(
                    `This user is currently locked until ${dayjs(
                      user.lockedUntil
                    )}. Please contact administrator.`
                  )
                } else if (
                  Number(user.lockedUntil?.getHours()) == Number(hoursNow)
                ) {
                  if (
                    Number(user.lockedUntil?.getMinutes() ?? 0) >
                    Number(dateNow.getMinutes())
                  ) {
                    throw new Error(
                      `This user is currently locked until ${dayjs(
                        user.lockedUntil
                      )}. Please contact administrator.`
                    )
                  }
                }
              }
            }
          } else {
            user.lockedUntil = null
          }
          const isValid = bcrypt.compareSync(
            credentials?.password ?? "",
            user.password
          )

          if (isValid) {
            await prisma.user.update({
              where: {
                username: credentials?.username,
              },
              data: { attempts: 0, inactivityDate: new Date() },
            })
            return user
          }
          let data = {}
          if (Boolean(user.lockedUntil)) {
            if (dateNow.getDate() == (user.lockedUntil?.getDate() ?? 0)) {
              if (dateNow.getHours() >= (user.lockedUntil?.getHours() ?? 0)) {
                data = {
                  attempts: (user.attempts = 0),
                  lockedUntil: (user.lockedUntil = value),
                  lockedReason: (user.lockedReason = value),
                  lockedAt: (user.lockedAt = value),
                }
              } else if (
                dateNow.getHours() == (user.lockedUntil?.getHours() ?? 0)
              ) {
                if (
                  dateNow.getMinutes() > (user.lockedUntil?.getMinutes() ?? 0)
                ) {
                  data = {
                    attempts: (user.attempts = 0),
                    lockedUntil: (user.lockedUntil = value),
                    lockedReason: (user.lockedReason = value),
                    lockedAt: (user.lockedAt = value),
                  }
                  throw new Error("ewan ko")
                }
              }
            } else if (dateNow.getDate() > (user.lockedUntil?.getDate() ?? 0)) {
              data = {
                attempts: (user.attempts = 0),
                lockedUntil: (user.lockedUntil = value),
                lockedReason: (user.lockedReason = value),
                lockedAt: (user.lockedAt = value),
              }
            }
          }

          if (user.attemptDate != undefined || null) {
            if (dateNow.getDate() > (user.attemptDate?.getDate() ?? 0)) {
              if (
                dateNow.getHours() > Number(user.attemptDate?.getHours() ?? 0)
              ) {
                data = {
                  attempts: (user.attempts = 0),
                  lockedUntil: (user.lockedUntil = null),
                  lockedReason: (user.lockedReason = null),
                  lockedAt: (user.lockedAt = null),
                }
              } else if (
                dateNow.getHours() == (user.attemptDate?.getHours() ?? 0)
              ) {
                if (
                  dateNow.getMinutes() > (user.attemptDate?.getMinutes() ?? 0)
                ) {
                  data = {
                    attempts: (user.attempts = 0),
                    lockedUntil: (user.lockedUntil = null),
                    lockedReason: (user.lockedReason = null),
                    lockedAt: (user.lockedAt = null),
                  }
                }
              }

              // else if (newDay > 1) {
              //   data = {
              //     attempts: (user.attempts = 0),
              //     lockedUntil: (user.lockedUntil = null),
              //     lockedReason: (user.lockedReason = null),
              //     lockedAt: (user.lockedAt = null),
              //   }
              // }
            }
          }
          //throw new Error(dateNow.getHours().toString() +"ewan ko" + user.lockedUntil?.toString())

          if (user.attempts < 3) {
            // checks if user has remaining attempts

            data = {
              attempts: (user.attempts += 1),
              lockedUntil: user.lockedUntil,
              lockedReason: user.lockedReason,
              lockedAt: user.lockedAt,
            }
          }

          if (user.attempts >= 3) {
            // locks user if user reached 5 attempts
            const lock_date = dayjs().minute(60).toDate()
            // console.log(lock_date)
            data = {
              lockedUntil: lock_date,
              lockedReason: "Too many attempts, Account is locked",
              lockedAt: new Date(),
            }
            //throw new Error(data.lockedReason)
          }

          if (user.attempts == 1) {
            data = {
              attemptDate: new Date(),
              attempts: user.attempts,
              lockedUntil: user.lockedUntil,
              lockedReason: user.lockedReason,
              lockedAt: user.lockedAt,
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
