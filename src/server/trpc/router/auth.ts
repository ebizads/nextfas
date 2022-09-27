import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";

export const authRouter = t.router({
  getSession: t.procedure.query(({ ctx }) => ctx.session),
  register: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        user_type: z.string().nullish(),
        image: z.string().nullish(),
        profile: z.object({
          first_name: z.string(),
          last_name: z.string(),
          middle_name: z.string().nullish(),
          suffix: z.string().nullish(),
          date_of_birth: z.date().nullish(),
          phone_no: z.string().nullish(),
          gender: z.string().nullish(),
        }),
        address: z
          .object({
            street: z.string().nullish(),
            city: z.string().nullish(),
            state: z.string().nullish(),
            zip: z.string().nullish(),
            country: z.string().nullish(),
          })
          .nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: input.password,
            image: input.image,
            user_type: input.user_type,
            username: (
              input.profile.first_name[0] + input.profile.last_name
            ).toLowerCase(),
            profile: {
              create: input.profile,
            },
            address: {
              create: input.address ?? undefined,
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
