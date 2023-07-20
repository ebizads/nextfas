import { z } from "zod"

export const AddressCreateInput = z.object({
  street: z
    .string({ required_error: "Street is required" })
    .min(1, "Street is required")
    .nullish(),

  province: z.string().nullish(),
  city: z.string().nullish(),
  region: z.string().nullish(),
  zip: z
    .number({ required_error: "Zip is required" })
    .min(1, "Zip is required")
    .nullish(),
  country: z
    .string({ required_error: "Country is required" })
    .min(1, "Country is required")
    .nullish(),
  baranggay: z.string().nullish(),
})

export const AddressEditInput = z.object({
  street: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip: z.number().nullish(),
  country: z.string().nullish(),
  baranggay: z.string().nullish(),
  region: z.string().nullish(),
  province: z.string().nullish(),

})
