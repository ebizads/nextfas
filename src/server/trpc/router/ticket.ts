import { ticketTableCreate } from "./../../schemas/ticket"
import { authedProcedure, t } from "../trpc"

export const ticketRouter = t.router({
  create: authedProcedure
    .input(ticketTableCreate)
    .mutation(async ({ input, ctx }) => {
      const { ...rest } = input
      // try {
      //   await ctx.prisma.ticketTable.create({
      //     data: {
      //       tableName: tableName,
      //       tableId: tableId,
      //       action: action,
      //       oldData: oldData,
      //       newData: newData,
      //       modifiedById: modifiedById,
      //       modifiedBy: {
      //         connect: {
      //           id: modifiedById ?? 0,
      //         },
      //       },
      //       ...rest,

      //     },
      //   })
      // } catch (error) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: JSON.stringify(error),
      //   })
      // }
    }),
})
