import { PrismaClient } from "@prisma/client"
import {
  assetSeed,
  categorySeed,
  classSeed,
  employeeSeed,
  locationSeed,
  projectSeed,
  typeSeed,
  userSeed,
  vendorSeed,
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
    const {
      address,
      profile,
      supervisee,
      team,
      teamId,
      superviseeId,
      ...rest
    } = e

    await prisma.employee.create({
      data: {
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
        supervisee: {
          connectOrCreate: {
            where: {
              id: superviseeId ?? 0,
            },
            create: {
              name: supervisee?.name ?? "DevOps",
            },
          },
        },
        team: {
          connectOrCreate: {
            where: {
              id: teamId ?? 0,
            },
            create: {
              name: team?.name ?? "DevOps",
            },
          },
        },
      },
    })
  }

  await prisma.$transaction([
    prisma.assetClass.createMany({
      data: classSeed,
    }),
    prisma.assetCategory.createMany({
      data: categorySeed,
    }),
    prisma.assetType.createMany({
      data: typeSeed,
    }),
    prisma.location.createMany({
      data: locationSeed,
    }),
    prisma.assetProject.createMany({
      data: projectSeed,
    }),
  ])

  for (const v of vendorSeed) {
    const { address, ...rest } = v

    await prisma.vendor.create({
      data: {
        ...rest,
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
  }

  for (const a of assetSeed) {
    const {
      management,
      model,
      custodianId,
      departmentId,
      vendorId,
      subsidiaryId,
      projectId,
      parentId,
      ...rest
    } = a

    await prisma.asset.create({
      data: {
        ...rest,
        model: {
          connectOrCreate: {
            where: {
              id: 0,
            },
            create: model,
          },
        },
        management: {
          connectOrCreate: {
            where: {
              id: 0,
            },
            create: management,
          },
        },
        custodian: {
          connect: {
            id: custodianId ?? 1,
          },
        },
        department: {
          connect: {
            id: departmentId ?? 1,
          },
        },
        vendor: {
          connect: {
            id: vendorId ?? 1,
          },
        },
        subsidiary: {
          connect: {
            id: subsidiaryId ?? 1,
          },
        },
        project: {
          connect: {
            id: projectId ?? 1,
          },
        },
        parent: {
          connect: {
            id: parentId ?? 1,
          },
        },
      },
    })
  }

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
