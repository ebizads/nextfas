import { z } from "zod"

export const AddressCreateInput = z.object({
  street: z.string().nullish(),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City is required"),
  state: z
    .string({ required_error: "Barangay is required" })
    .min(1, "Barangay is required"),
  zip: z
    .string({ required_error: "Zip is required" })
    .min(1, "Zip is required"),
  country: z
    .string({ required_error: "Country is required" })
    .min(1, "Country is required"),
  shipping_address: z.string().nullish(),
  billing_address: z.string().nullish(),
})

export const AddressEditInput = z
  .object({
    street: z.string().nullish().optional(),
    city: z.string().nullish().optional(),
    state: z.string().nullish().optional(),
    zip: z.string().nullish().optional(),
    country: z.string().nullish().optional(),
    shipping_address: z.string().nullish().optional(),
    billing_address: z.string().nullish().optional(),
  })
  .nullish()
  .optional()
