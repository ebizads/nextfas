import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const CreateUserInput = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  email: z.string({ required_error: "Email is required" }).email().min(1),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{1,}$/,
      {
        message: "Password does not match the given restrictions",
      }
    )
    .min(12, { message: "Password should be at least 12 characters" })
    .max(20, { message: "Password should not be more than 20 characters" }),
  user_type: z.string().nullish(),
  image: z.string().nullish(),
  profile: z.object({
    first_name: z
      .string({ required_error: "First Name is required" })
      .min(1, { message: "First name is required" }),
    last_name: z
      .string({ required_error: "Last Name is required" })
      .min(1, "Last name is required"),
    middle_name: z.string().nullish(),
    suffix: z.string().nullish(),
    date_of_birth: z.date().nullish(),
    phone_no: z.number().nullish(),
    gender: z.string().nullish(),
  }),
  address: AddressCreateInput,
})

export const EditUserInput = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  user_type: z.string().optional(),
  image: z.string().optional(),
  profile: z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    middle_name: z.string().optional(),
    suffix: z.string().optional(),
    date_of_birth: z.date().optional(),
    phone_no: z.number().optional(),
    gender: z.string().optional(),
  }),
  address: AddressEditInput,
})
