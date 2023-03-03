import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const CreateUserInput = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  email: z.string({ required_error: "Email is required" }).email().min(1),
  password: z.string(),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{1,}$/,
  //   {
  //     message: "Password does not match the given restrictions",
  //   }
  // )
  // .min(12, { message: "Password should be at least 12 characters" })
  // .max(20, { message: "Password should not be more than 20 characters" }),
  oldPassword: z.array(z.string()).optional().default([]),
  user_type: z.string().nullish(),
  image: z.string().nullish(),
  firstLogin: z.boolean().nullish(),
  validateTable: z.object({
    certificate: z.string().nullish(),
    validationDate: z.date().nullish(),
  }),
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
    phone_no: z.string().nullish(),
    gender: z.string().nullish(),
    image: z.string().nullish(),
  }),
  user_Id: z.string().nullish(),
  inactivityDate: z.date().nullish(),
  passwordAge: z.date().nullish(),
  hired_date: z.date().nullish(),
  position: z.string({required_error: "Position is required"}).min(1, {message: "Position is required"}),
  address: AddressCreateInput,
  teamId: z.number({required_error: "Team is required"}),
})

export const CreateArchiveUser = z.object({
  name: z.string().optional().nullish(),
  email: z.string().email().optional().nullish(),
  user_Id: z.string().nullish(),
  hired_date: z.date().nullish(),
  position: z.string().optional().nullish(),
  old_id: z.number().optional(),
  teamId: z.number().nullish(),
})
export const ChangeUserPass = z.object({
  id: z.number(),
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
  oldPassword: z.array(z.string()).optional().default([]),
  passwordAge: z.date().nullish(),
  firstLogin: z.boolean().nullish(),
})

export const EditUserInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z.string().optional(),
  user_type: z.string().nullish(),
  image: z.string().nullish(),
  profile: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    middle_name: z.string().nullish(),
    suffix: z.string().nullish(),
    date_of_birth: z.date().nullish(),
    phone_no: z.string().nullish(),
    gender: z.string().nullish(),
    image: z.string().nullish(),
  }).optional(),
  validateTable: z.object({
    certificate: z.string().nullish(),
    validationDate: z.date().nullish(),
  }).optional(),
  passwordAge: z.date().nullish(),
  hired_date: z.date().nullish(),
  position: z.string().nullish(),
  address: AddressEditInput,
  teamId: z.number().optional(),
  inactivityDate: z.date().nullish(),
  user_Id: z.string().nullish().optional(),
})

export const IdUser = z.object({
  id: z.number(),
})

