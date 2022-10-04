import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  SupplierCreateInput,
  SupplierEditInput,
} from "../../common/input-types";
import { authedProcedure, t } from "../trpc";

export const supplierRouter = t.router({
  findAll: authedProcedure.query(async ({ ctx }) => {
    const suppliers = await ctx.prisma.supplier.findMany();
    return suppliers;
  }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const supplier = await ctx.prisma.supplier.findUnique({
      where: {
        id: input,
      },
    });
    return supplier;
  }),
  create: authedProcedure
    .input(SupplierCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { address, ...rest } = input;

      try {
        await ctx.prisma.supplier.create({
          data: {
            ...rest,
            address: {
              create: address ?? undefined,
            },
          },
        });
        return "Supplier successfully created";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  edit: authedProcedure
    .input(SupplierEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, address, ...rest } = input;
      try {
        await ctx.prisma.supplier.update({
          where: {
            id,
          },
          data: {
            ...rest,
            address: {
              create: address ?? undefined,
            },
          },
        });
        return "Supplier successfully edited";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.supplier.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
        },
      });
      return "Supplier successfully deleted";
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: JSON.stringify(error),
      });
    }
  }),
});
