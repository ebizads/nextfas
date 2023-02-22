import { z } from "zod"

export const AddressCreateInput = z.object({
  street: z.string().nullish(),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City is required")
    .nullish(),
  state: z
    .string({ required_error: "Barangay is required" })
    .min(1, "Barangay is required")
    .nullish(),
  zip: z
    .string({ required_error: "Zip is required" })
    .min(1, "Zip is required")
    .nullish(),
  country: z
    .string({ required_error: "Country is required" })
    .min(1, "Country is required")
    .nullish(),
})

export const AddressEditInput = z
  .object({
    id: z.number(),
    street: z.string().nullish().optional(),
    city: z.string().nullish().optional(),
    state: z.string().nullish().optional(),
    zip: z.string().nullish().optional(),
    country: z.string().nullish().optional(),
    shipping_address: z.string().nullish().optional(),
    billing_address: z.string().nullish().optional(),
  })
  .optional()
