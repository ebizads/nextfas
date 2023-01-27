import { ticketTableCreate } from "./../../schemas/ticket"
import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { authedProcedure, t } from "../trpc"

export const ticketRouter = t.router({
  //   findAll: authedProcedure.input(
  //     z
  //       .object({
  //         search: z
  //           .object({
  //             from_table: z.string(),
  //             table_id: z.number(),
  //             action_type: z.string(),
  //             action_desc: z.string().nullish(),
  //             addedById: z.number(),
  //             addedBy: IdUser,
  //           })
  //           .optional(),
  //         filter: z
  //           .object({
  //             added_date: z.date(),
  //           })
  //           .optional(),
  //       })
  //       .optional()
  //   ),

  create: authedProcedure
    .input(ticketTableCreate)
    .mutation(async ({ input, ctx }) => {
      const {
        from_table,
        table_id,
        action_type,
        action_desc,
        addedById,
        ...rest
      } = input
      try {
        await ctx.prisma.ticketTable.create({
          data: {
            ...rest,
            from_table: from_table,
            table_id: table_id,
            action_type: action_type,
            action_desc: action_desc,
            addedBy: {
              connect: {
                id: addedById ?? 0,
              },
            },
            // from_table: {
            //   create: from_table,
            // },
          },
        })
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        })
      }
    }),
})
