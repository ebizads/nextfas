import { PrismaClient } from "@prisma/client"
import {
  categorySeed,
  classSeed,
  employeeSeed,
  typeSeed,
  userSeed,
} from "./seed.data"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const main = async () => {
  for (const u of userSeed) {
    const { address, profile, ...rest } = u

    await prisma.user.create({
      data: {
        ...rest,
        password: await bcrypt.hash(u.password, 10),
        username: (profile.first_name[0] + profile.last_name)
          .replace(" ", "")
          .toLowerCase(),
        address: {
          create: address,
        },
        profile: {
          create: profile,
        },
      },
    })
  }

  for (const e of employeeSeed) {
    const { address, profile, ...rest } = e

    await prisma.employee.create({
      data: {
        ...rest,
        address: {
          create: address,
        },
        profile: {
          create: profile,
        },
      },
    })
  }

  await prisma.$transaction([
    prisma.category.createMany({
      data: categorySeed,
    }),
    prisma.asset_class.createMany({
      data: classSeed,
    }),
    prisma.type.createMany({
      data: typeSeed,
    }),
  ])

  console.log("Seeding successful!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.log(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
