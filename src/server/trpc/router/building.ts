import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { authedProcedure, t } from "../trpc"

export const buildingRouter = t.router({
    findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
        const building = await ctx.prisma.building.findUnique({
            where: {
                id: input,
            },
        })
        return building
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
                        })
                        .optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            try {
                const [building, count] = await ctx.prisma.$transaction(
                    [
                        ctx.prisma.building.findMany({
                            orderBy: {
                                createdAt: "desc",
                            },
                            skip: input?.page
                                ? (input.page - 1) * (input.limit ?? 10)
                                : undefined,
                            take: input?.limit ?? 10,
                            where: {
                                name: {
                                    contains: input?.search?.name ? input.search.name : undefined,
                                    mode: 'insensitive'
                                },
                                NOT: {
                                    deleted: true,
                                },
                            },
                        }),
                        ctx.prisma.building.count({
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
                    building,
                    count,
                }
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: JSON.stringify(error),
                })
            }
        }),
    create: authedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const building = await ctx.prisma.building.create({
                data: {
                    name: input.name,
                },
            })
            return building
        }),
})
