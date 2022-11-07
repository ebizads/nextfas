import { z } from "zod"

export const LocationCreateInput = z
  .object({
    department: z.string().optional(),
    floor: z.string().optional(),
    room: z.string().optional(),
  })
  .optional()

export const GeneralCreateInput = z.object({
  currency: z.string().nullish().optional(),
  purchase_date: z.date().nullish().optional(),
  custodianId: z.number().nullish().optional(),
  classId: z.number().nullish().optional(),
  location: LocationCreateInput.optional(),
  physical_location: LocationCreateInput.optional(),
})

export const DepreciationRulesCreateInput = z.object({
  acquisition: z.string().nullish().optional(),
  pro_rata: z.string().nullish().optional(),
  disposal: z.string().nullish().optional(),
  mid_month: z.date().nullish().optional(),
})

export const RevisionRulesCreateInput = z.object({
  financial_start_year: z.string().nullish().optional(),
  annual_method_entry: z.string().nullish().optional(),
  convention: z.string().nullish().optional(),
  period_convention: z.string().nullish().optional(),
  depreciation_period: z.string().nullish().optional(),
  prior_year_NBV: z.string().nullish().optional(),
  group_depreciation: z.string().nullish().optional(),
  group_master: z.string().nullish().optional(),
  allow_override: z.string().nullish().optional(),
  add_alternative_method: z.string().nullish().optional(),
  store_history: z.string().nullish().optional(),
})

export const AssetCreateInput = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),
  number: z
    .string({ required_error: "Asset number is required" })
    .min(1, { message: "Asset number is required" }),
  description: z.string().nullish(),
  serial_number: z.string().nullish(),
  original_cost: z.number().nullish(),
  current_cost: z.number().nullish(),
  current_netbook_value: z.number().nullish(),

  project: z.string().nullish(),
  alt_number: z.string().nullish(),
  residual_value: z.number().nullish(),
  residual_value_percentage: z.number().nullish(),
  accounting_method: z.string().nullish(),
  asset_lifetime: z.number().nullish(),

  parentId: z.number().nullish(),
  typeId: z.number().nullish(),
  categoryId: z.number().nullish(),
  manufacturerId: z.number().nullish(),
  vendorId: z.number().nullish(),

  model: z
    .object({
      name: z.string(),
      number: z.string().nullish(),
      brand: z.string().nullish(),
    })
    .nullish(),

  general: GeneralCreateInput.optional(),
  depreciation_rules: DepreciationRulesCreateInput.optional(),
  revision_rules: RevisionRulesCreateInput.optional(),
})

export const AssetEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  number: z.string().optional(),
  description: z.string().nullish().optional(),
  serial_number: z.string().nullish().optional(),
  original_cost: z.number().nullish().optional(),
  current_cost: z.number().nullish().optional(),
  current_netbook_value: z.number().nullish().optional(),

  typeId: z.number().nullish().optional(),
  categoryId: z.number().nullish().optional(),
  manufacturerId: z.number().nullish().optional(),
  vendorId: z.number().nullish().optional(),
  modelId: z.number().nullish().optional(),

  model: z
    .object({
      name: z.string(),
      number: z.string().nullish().optional(),
      brand: z.string().nullish().optional(),
    })
    .nullish()
    .optional(),
})
