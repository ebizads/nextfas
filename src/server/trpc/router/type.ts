import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TypeCreateInput, TypeEditInput } from "../../common/input-types";
import { authedProcedure, t } from "../trpc";

export const typeRouter = t.router({
  findAll: authedProcedure.query(async ({ ctx }) => {
    const types = await ctx.prisma.type.findMany();
    return types;
  }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const type = await ctx.prisma.type.findUnique({
      where: {
        id: input,
      },
    });
    return type;
  }),
  create: authedProcedure
    .input(TypeCreateInput)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.type.create({
          data: input,
        });
        return "Type successfully created";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  edit: authedProcedure
    .input(TypeEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      try {
        await ctx.prisma.type.update({
          where: {
            id,
          },
          data: {
            ...rest,
          },
        });
        return "Type successfully edited";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.type.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
        },
      });
      return "Type successfully deleted";
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: JSON.stringify(error),
      });
    }
  }),
});
