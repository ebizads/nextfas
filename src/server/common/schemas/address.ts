import { z } from "zod"

export const AddressCreateInput = z
  .object({
    street: z.string().nullish(),
    city: z.string().nullish(),
    state: z.string().nullish(),
    zip: z.string().nullish(),
    country: z.string().nullish(),
    shipping_address: z.string().nullish(),
    billing_address: z.string().nullish(),
  })
  .optional()

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
