import { z } from "zod"
import { ModelCreateInput } from "./model"

export const AssetCreateInput = z.object({
  name: z.string(),
  number: z.string(),
  serial_no: z.string().nullish(),
  barcode: z.string().nullish(),
  description: z.string().nullish(),

  model: ModelCreateInput,
  custodianId: z.number().optional(),
  locationId: z.number().optional(),
  vendorId: z.number().optional(),
  management: z.object({
    currency: z.string().nullish(),
    original_cost: z.number().nullish(),
    current_cost: z.number().nullish(),
    residual_value: z.number().nullish(),
    purchase_date: z.date().nullish(),

    depreciation_start: z.date().nullish(),
    depreciation_end: z.date().nullish(),
    depreciation_status: z.string().nullish(),
    depreciation_period: z.number().nullish(),
    depreciation_rule: z.string().nullish(),
  }),
})
