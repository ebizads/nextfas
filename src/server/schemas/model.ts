import { z } from "zod"

export const AssetClassCreateInput = z.object({
  name: z.string().nullish(),
})

export const AssetTypeCreateInput = z.object({
  name: z.string().nullish(),
})

export const AssetCategoryCreateInput = z.object({
  name: z.string().nullish(),
})

export const TypeEditInput = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  categoryId: z.number().optional(),
})

export const AssetClassEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
})

export const AssetTypeEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
})

export const AssetCategoryEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
})

export const SubsidiaryEditInput = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullish(),
})

export const ModelCreateInput = z.object({
  name: z.string().min(1, "Please provide model name"),
  brand: z.string().optional(),
  number: z.string().optional(),

  // asset_class: AssetClassCreateInput
  classId: z.number({ required_error: "Please select asset class" }),
  //asset_category: AssetCategoryCreateInput,
  categoryId: z.number({ required_error: "Please select asset category" }),
  //asset_type: AssetTypeCreateInput,
  typeId: z.number({ required_error: "Please select asset type" }),
})

export const ModelEditInput = z.object({
  name: z.string().min(1, "Please provide model name"),
  brand: z.string().optional(),
  number: z.string().optional(),

  asset_class: AssetClassCreateInput.optional(),
  classId: z.number().optional(),
  asset_category: AssetCategoryCreateInput.optional(),
  categoryId: z.number().optional(),
  asset_type: AssetTypeCreateInput.optional(),
  typeId: z.number().optional(),
  type: TypeEditInput.optional(),
})

export const ManagementCreateInput = z.object({
  currency: z.string().optional().nullish(),
  original_cost: z.number().optional().nullish(),
  current_cost: z.number().optional().nullish(),
  residual_value: z.number().nullish().nullish(),
  purchase_date: z.date().nullish(),

  depreciation_start: z.date().nullish(),
  depreciation_end: z.date().nullish(),
  depreciation_status: z.string().nullish(),
  depreciation_period: z.number().nullish(),
  depreciation_lifetime: z.number().nullish(),
  depreciation_rule: z.string().nullish(),
  accounting_method: z.string().nullish(),
  remarks: z.string().nullish(),
  // id: z.number(),
})

export const ManagementEditInput = z.object({
  id: z.number(),
  currency: z.string().optional().nullish(),
  original_cost: z.number().optional().nullish(),
  current_cost: z.number().optional().nullish(),
  residual_value: z.number().nullish().nullish(),
  purchase_date: z.date().nullish(),

  depreciation_start: z.date().nullish(),
  depreciation_end: z.date().nullish(),
  depreciation_status: z.string().nullish(),
  depreciation_period: z.number().nullish(),
  depreciation_lifetime: z.number().nullish(),
  depreciation_rule: z.string().nullish(),
  accounting_method: z.string().nullish(),
})
