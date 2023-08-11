import { z } from "zod"
import { authedProcedure, t } from "../trpc"

import { TRPCError } from "@trpc/server"
import { createIssuance, initialIssuance, returnAsset } from "../../schemas/issuance"

export const assetIssuanceRouter = t.router({
    findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
        const assetDisposal = await ctx.prisma.assetIssuance.findUnique({
            where: {
                id: input,
            },
            include: {
                issuedBy: true,
                issuedTo: true,
                pastIssuance: true,
                asset: {
                    include: {
                        department: true,
                    },
                },
            },
        })
        return assetDisposal
    }),
    findAll: authedProcedure
        .input(
            z
                .object({
                    page: z.number().optional(),
                    limit: z.number().optional(),
                    search: z
                        .object({
                            returnedAt: z.date().optional(),
                            issuanceStatus: z.string().optional(),
                            issuedAt: z.date().optional(),
                            pastIssuanceId: z.number().optional(),
                            issuedById: z.number().optional(),
                        })
                        .optional(),
                    filter: z
                        .object({
                            updatedAt: z.date().optional(),
                        })
                        .optional(),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const [assetIssuance, count] = await ctx.prisma.$transaction([
                ctx.prisma.assetIssuance.findMany({
                    orderBy: {
                        createdAt: "asc",
                    },
                    include: {
                        asset: {
                            include: {
                                department: true,
                            },
                        },
                        issuedBy: true,
                        issuedTo: true,
                        pastIssuance: true,
                    },
                    where: {
                        issuanceStatus: input?.search?.issuanceStatus,
                        NOT: {
                            deleted: true,
                        },
                    },
                    skip: input?.page
                        ? (input.page - 1) * (input.limit ?? 10)
                        : undefined,
                    take: input?.limit ?? 10,
                }),
                ctx.prisma.assetIssuance.count({
                    where: {
                        NOT: {
                            deleted: true,
                        },
                    },
                }),
            ])

            return {
                assetIssuance,
                count,
                pages: Math.ceil(count / (input?.limit ?? 0)),
                total: count,
            }
        }),
    create: authedProcedure
        .input(initialIssuance)
        .mutation(async ({ ctx, input }) => {
            const { issuedToId, issuedById, assetId, ...rest } = input

            const assetIssuance = await ctx.prisma.assetIssuance.create({
                data: {
                    issuedTo: {
                        connect: {
                            id: issuedToId ?? 0
                        }
                    },
                    issuedBy: {
                        connect: {
                            id: issuedById ?? 0,
                        }
                    },
                    asset: {
                        connect: {
                            id: assetId ?? 0
                        }
                    },
                    // asset: {
                    //     connect: {
                    //         id: assetId
                    //     }
                    // },
                    ...rest,
                },
                include: {
                    issuedTo: true,
                    asset: {
                        include: {
                            department: true,
                        },
                    },
                },
            })
            return assetIssuance
        }),
    edit: authedProcedure
        .input(createIssuance)
        .mutation(async ({ ctx, input }) => {
            const { id, issuedById, issuedToId, assetId, ...rest } = input
            try {
                await ctx.prisma.assetIssuance.update({
                    where: {
                        id,
                    },
                    data: {
                        issuedTo: {
                            connect: {
                                id: issuedToId
                            },
                        },
                        issuedBy: {
                            connect: {
                                id: issuedById
                            },
                        },
                        asset: {
                            connect: {
                                id: assetId
                            }
                        },
                        ...rest
                    },
                    include: {
                        issuedTo: true,
                        issuedBy: true,
                        asset: {
                            include: {
                                department: true,
                            },
                        },
                    },
                })

                return "Asset updated successfully"
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: JSON.stringify(error),
                })
            }
        }),
    return: authedProcedure
        .input(returnAsset)
        .mutation(async ({ ctx, input }) => {
            const { id, assetId, issuedById, issuedToId, pastIssuanceId, ...rest } = input
            try {
                await ctx.prisma.assetIssuance.update({
                    where: {
                        id,
                    },
                    data: {
                        issuedTo: {
                            connect: {
                                id: issuedToId ?? 0
                            },
                        },
                        issuedBy: {
                            connect: {
                                id: issuedById ?? 0
                            },
                        },
                        pastIssuance: {
                            connect: {
                                id: pastIssuanceId ?? 0
                            }
                        },
                        asset: {
                            connect: {
                                id: assetId
                            }
                        },
                        ...rest
                    },
                    include: {
                        issuedTo: true,
                        issuedBy: true,
                        pastIssuance: true,
                        asset: {
                            include: {
                                department: true,
                            },
                        },
                    },
                })

                return "Asset updated successfully"
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: JSON.stringify(error),
                })
            }
        }),

})
