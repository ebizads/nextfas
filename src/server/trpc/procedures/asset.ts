import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { AssetCreateInput } from "../../common/schemas/asset"
import { authedProcedure } from "../trpc"

export const CreateAssetProcudure = authedProcedure
  .input(AssetCreateInput)
  .mutation(async ({ ctx, input }) => {
    const { model, general, ...rest } = input

    try {
      const [asset] = await ctx.prisma.$transaction(
        [
          ctx.prisma.asset.create({
            data: {
              ...rest,
            },
          }),
          ctx.prisma.asset.update({
            where: {
              number: rest.number,
            },
            data: {
              model: {
                create: model ?? undefined,
              },
            },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      )

      // general asset information
      await ctx.prisma.$transaction([
        ctx.prisma.asset.update({
          where: {
            id: asset.id,
          },
          data: {
            general: {
              create: {
                classId: general?.classId ?? undefined,
                custodianId: general?.custodianId ?? undefined,
              },
            },
          },
        }),
        ctx.prisma.asset.update({
          where: {
            id: asset.id,
          },
          data: {
            general: {
              update: {
                location: {
                  create: general?.location ?? undefined,
                },
                physical_location: {
                  create: general?.physical_location ?? undefined,
                },
              },
            },
          },
        }),
      ])

      return "Asset successfully created"
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: JSON.stringify(error),
      })
    }
  })
