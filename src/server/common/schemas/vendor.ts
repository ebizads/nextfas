import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const VendorCreateInput = z.object({
  name: z.string(),
  email: z.string().email(),
  type: z.string().nullish(),
  url: z.string().nullish(),
  image: z.string().nullish(),
  remarks: z.string().nullish(),
  fax_no: z.string().nullish(),
  alt_phone_no: z.string().nullish(),
  phone_no: z.string().nullish(),

  address: AddressCreateInput.nullish(),
})

export const VendorEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  type: z.string().nullish().optional(),
  url: z.string().nullish().optional(),
  image: z.string().nullish().optional(),
  remarks: z.string().nullish().optional(),
  fax_no: z.string().nullish().optional(),
  alt_phone_no: z.string().nullish().optional(),
  phone_no: z.string().nullish().optional(),

  address: AddressEditInput,
})
