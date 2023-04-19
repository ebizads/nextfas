import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { AddLocationDetails } from "../../schemas/maintenance"
import { authedProcedure, t } from "../trpc"
import { Prisma } from "@prisma/client"

export const maintenanceRouter = t.router({
  findOne: authedProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const location = await ctx.prisma.location.findUnique({
      where: {
        id: input,
      },
    })
    return location
  }),

  findAll: authedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z
            .object({
              building: z.string().optional(),
              floor: z.string().optional(),
              room: z.string().optional(),
             
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const [location, count] = await ctx.prisma.$transaction(
          [
            ctx.prisma.location.findMany({
              orderBy: {
                createdAt: "desc",
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
            ctx.prisma.location.count(),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        )   
        return {
          location,
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

    create: authedProcedure
    .input(AddLocationDetails)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.location.create({
          data: {
            floor: input.floor,
            room: input.room,
            building: input.building,
        },
        })
        return "Location created successfully"
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
