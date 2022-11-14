import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const VendorCreateInput = z.object({
  name: z.string(),
  phone_no: z.array(z.string()),
  email: z.string().nullish(),
  website: z.string().nullish(),
  remarks: z.string().nullish(),
  fax_no: z.string().nullish(),
  type: z.string().nullish(),

  address: AddressCreateInput,
})

export const VendorEditInput = z.object({
  id: z.number(),
  name: z.string().nullish().optional(),
  phone_no: z.array(z.string()).optional(),
  email: z.string().nullish().optional(),
  website: z.string().nullish().optional(),
  remarks: z.string().nullish().optional(),
  fax_no: z.string().nullish().optional(),
  type: z.string().nullish().optional(),

  address: AddressEditInput,
})
