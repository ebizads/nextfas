import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  ManufacturerCreateInput,
  ManufacturerEditInput,
} from "../../common/input-types";
import { authedProcedure, t } from "../trpc";

export const manufacturerRouter = t.router({
  findAll: authedProcedure.query(async ({ ctx }) => {
    const manufacturers = await ctx.prisma.manufacturer.findMany();
    return manufacturers;
  }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const manufacturer = await ctx.prisma.manufacturer.findUnique({
      where: {
        id: input,
      },
    });
    return manufacturer;
  }),
  create: authedProcedure
    .input(ManufacturerCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { address, ...rest } = input;

      try {
        await ctx.prisma.manufacturer.create({
          data: {
            ...rest,
            address: {
              create: address ?? undefined,
            },
          },
        });
        return "Manufacturer successfully created";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  edit: authedProcedure
    .input(ManufacturerEditInput)
    .mutation(async ({ ctx, input }) => {
      const { id, address, ...rest } = input;
      try {
        await ctx.prisma.manufacturer.update({
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
        return "Manufacturer successfully edited";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.manufacturer.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
        },
      });
      return "Manufacturer successfully deleted";
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: JSON.stringify(error),
      });
    }
  }),
});
