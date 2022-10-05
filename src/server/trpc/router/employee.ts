import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  EmployeeCreateInput,
  EmployeeEditInput,
} from "../../common/input-types";
import { authedProcedure, t } from "../trpc";

export const employeeRouter = t.router({
  findAll: authedProcedure.query(async ({ ctx }) => {
    const employees = await ctx.prisma.employee.findMany();
    return employees;
  }),
  findOne: authedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const employee = await ctx.prisma.employee.findUnique({
      where: {
        id: input,
      },
      include: {
        profile: true,
      },
    });
    return employee;
  }),
  create: authedProcedure
    .input(EmployeeCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { profile, address, ...rest } = input;

      try {
        await ctx.prisma.employee.create({
          data: {
            ...rest,
            profile: {
              create: profile ?? undefined,
            },
            address: {
              create: address ?? undefined,
            },
          },
        });
        return "Employee successfully created";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  edit: authedProcedure
    .input(EmployeeEditInput)
    .mutation(async ({ ctx, input }) => {
      const { profile, address, id, ...rest } = input;

      try {
        await ctx.prisma.employee.update({
          where: {
            id,
          },
          data: {
            ...rest,
            profile: { update: profile ?? undefined },
            address: { update: address ?? undefined },
          },
        });
        return "Employee successfully edited";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
  delete: authedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.employee.update({
        where: {
          id: input,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
      return "Employee successfully deleted";
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: JSON.stringify(error),
      });
    }
  }),
});
