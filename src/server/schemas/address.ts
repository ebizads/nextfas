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
    street: z.string().nullish(),
    city: z.string().nullish(),
    state: z.string().nullish(),
    zip: z.string().nullish(),
    country: z.string().nullish(),
  })
  .optional()
