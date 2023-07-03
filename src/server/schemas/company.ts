import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const CompanyCreateInput = z.object({
  name: z.string(),
  phone_no: z.array(z.string()),
  email: z.string().nullish(),
  website: z.string().nullish(),
  remarks: z.string().nullish(),

  address: AddressCreateInput,
})

export const CompanyEditInput = z.object({
  id: z.number(),
  name: z.string().nullish().optional(),
  phone_no: z.array(z.string()).optional(),
  email: z.string().nullish().optional(),
  website: z.string().nullish().optional(),
  remarks: z.string().nullish().optional(),

  address: AddressEditInput,
})
export const CompanyTableEditInput = z.object({
  id: z.number(),
  name: z.string(),
  phone_no: z.array(z.string()),
  email: z.string().nullish(),
  website: z.string().nullish(),
  remarks: z.string().nullish(),
})

