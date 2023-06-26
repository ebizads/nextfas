import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const VendorCreateInput = z.object({
  name: z.string(),
  phone_no: z.array(z.string()),
  email: z
    .string()
    .regex(/\S+@\S+\.\S+/, "Invalid Email input")
    .nullish(),
  website: z
    .string()
    // .min(1, "City is required")
    .regex(/.+\..+/, "Format invalid")
    .nullish(),
  remarks: z.string().nullish(),
  fax_no: z.string().nullish(),
  type: z.string().nullish(),

  address: AddressCreateInput,
})

export const VendorEditInput = z.object({
  id: z.number(),
  name: z.string(),
  phone_no: z.array(z.string()),
  email: z
    .string()
    .regex(/\S+@\S+\.\S+/, "Invalid Email input")
    .nullish(),
  website: z
    .string()
    // .string()
    .regex(/.+\..+/, "Format invalid"),
  remarks: z.string().nullish(),
  fax_no: z.string().nullish(),
  type: z.string().nullish(),

  address: AddressEditInput,
})


export const VendorDelete = z.object({
  id: z.number(),
})

