import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const EmployeeCreateInput = z.object({
  name: z.string(),
  employee_id: z.string(),
  email: z.string().email(),
  image: z.string().nullish(),
  work_calendarId: z.number().nullish(),
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
    phone_no: z
      .string({ required_error: "Last Name is required" })
      .min(11, "Not a valid mobile number")
      .max(11, "Not a valid mobile number")
      .nullish(),
    gender: z.string().nullish(),
  }),
  hired_date: z.date().nullish(),
  subsidiary: z
    .string({ required_error: "Subsidiary is required" })
    .min(1, "Subsidiary is required")
    .nullish(),
  department: z
    .string({ required_error: "Department is required" })
    .min(1, "Department is required")
    .nullish(),
  position: z
    .string({ required_error: "Position is required" })
    .min(1, "Position is required")
    .nullish(),
  address: AddressCreateInput,
})

export const EmployeeEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  employee_id: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().nullish().optional(),
  work_calendarId: z.number().nullish().optional(),
  profile: z
    .object({
      first_name: z
        .string()
        .min(1, { message: "First name is required" })
        .optional(),
      last_name: z
        .string({ required_error: "Last Name is required" })
        .min(1, "Last name is required")
        .optional(),
      middle_name: z.string().nullish(),
      suffix: z.string().nullish(),
      date_of_birth: z.date().nullish(),
      phone_no: z.string().nullish(),
      gender: z.string().nullish(),
    })
    .nullish()
    .optional(),
  hired_date: z.date().nullish().optional(),
  subsidiary: z.string().nullish().optional(),
  department: z.string().nullish().optional(),
  position: z.string().nullish().optional(),
  address: AddressEditInput,
})
