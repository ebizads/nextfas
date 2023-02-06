import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"
import { DepartmentEditInput } from "./department"

export const EmployeeCreateInput = z.object({
  name: z.string().optional(),
  employee_id: z.string().nullish(),
  email: z
    .string()
    .regex(/\S+@\S+\.\S+/, "Invalid Email input")
    .nullish(),
  hired_date: z.date().nullish(),
  position: z.string().nullish(),
  profile: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    middle_name: z.string().nullish(),
    suffix: z.string().nullish(),
    date_of_birth: z.date().nullish(),
    phone_no: z.string().nullish(),
    gender: z.string().nullish(),
    image: z.string().nullish(),
  }),
  address: AddressCreateInput,
  teamId: z.number().optional(),
})

export const EmployeeEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  employee_id: z.string().nullish().optional(),
  email: z
    .string()
    .regex(/.+\..+/, "Format invalid")
    .nullish()
    .optional(),
  hired_date: z.date().nullish().optional(),
  position: z.string().nullish().optional(),
  profile: z
    .object({
      first_name: z.string().min(1).optional(),
      last_name: z.string().min(1).optional(),
      middle_name: z.string().nullish().optional(),
      suffix: z.string().nullish().optional(),
      date_of_birth: z.date().nullish().optional(),
      phone_no: z.string().nullish().optional(),
      gender: z.string().nullish().optional(),
      image: z.string().nullish().optional(),
    })
    .optional(),
  address: AddressEditInput,
  teamId: z.number().optional(),
})
