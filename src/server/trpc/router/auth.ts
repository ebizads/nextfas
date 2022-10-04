import { TRPCError } from "@trpc/server";
import { t } from "../trpc";
import bcrypt from "bcrypt";
import { RegisterUserInput } from "../../common/input-types";

export const authRouter = t.router({
  getSession: t.procedure.query(({ ctx }) => ctx.session),
  register: t.procedure
    .input(RegisterUserInput)
    .mutation(async ({ input, ctx }) => {
      const { address, profile, password, ...rest } = input;

      const encryptedPassword = await bcrypt.hash(password, 10);
      try {
        await ctx.prisma.user.create({
          data: {
            ...rest,
            password: encryptedPassword,
            username: (profile.first_name[0] + profile.last_name).toLowerCase(),
            profile: {
              create: profile ?? undefined,
            },
            address: {
              create: address ?? undefined,
            },
          },
        });
        return "User created successfully";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify(error),
        });
      }
    }),
});
