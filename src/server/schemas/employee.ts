import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"
import { DepartmentEditInput } from "./department"

export const EmployeeCreateInput = z.object({
  name: z.string().optional(),
  superviseeId: z.number().nullish().optional(),
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
      first_name: z.string().min(1),
      last_name: z.string().min(1),
      middle_name: z.string().nullish().optional(),
      suffix: z.string().nullish().optional(),
      date_of_birth: z.date().nullish().optional(),
      phone_no: z.string().nullish().optional(),
      gender: z.string().nullish().optional(),
      image: z.string().nullish().optional(),
    })
    .optional(),
  address: AddressCreateInput,
  workStation: z.string().nullish(),
  workMode: z.string().nullish(),
  teamId: z.number().optional(),
})

export const EmployeeEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  superviseeId: z.number().nullish().optional(),
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
      first_name: z.string().min(1),
      last_name: z.string().min(1),
      middle_name: z.string().nullish().optional(),
      suffix: z.string().nullish().optional(),
      date_of_birth: z.date().nullish().optional(),
      phone_no: z.string().nullish().optional(),
      gender: z.string().nullish().optional(),
      image: z.string().nullish().optional(),
    })
    .optional(),
  address: AddressEditInput,
  workStation: z.string().nullish(),
  workMode: z.string().nullish(),
  teamId: z.number().optional(),
})
export const EmployeeTableEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  superviseeId: z.number().nullish().optional(),
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
      first_name: z.string(),
      last_name: z.string(),
      middle_name: z.string().nullish().optional(),
      suffix: z.string().nullish().optional(),
      date_of_birth: z.date().nullish().optional(),
      phone_no: z.string().nullish().optional(),
      gender: z.string().nullish().optional(),
      image: z.string().nullish().optional(),
    }),
  address: AddressEditInput,
  workStation: z.string().nullish(),
  workMode: z.string().nullish(),
  teamId: z.number().optional(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  deleted: z.boolean(),
})


export const EmployeeDeleteInput = z.object({
  id: z.number(),
})