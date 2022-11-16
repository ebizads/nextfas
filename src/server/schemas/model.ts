import { z } from "zod"

export const AssetClassCreateInput = z.object({
  name: z.string(),
})

export const AssetTypeCreateInput = z.object({
  name: z.string(),
})

export const AssetCategoryCreateInput = z.object({
  name: z.string(),
})

export const ModelCreateInput = z.object({
  name: z.string(),
  brand: z.string().optional(),
  number: z.string().optional(),

  asset_class: AssetClassCreateInput.optional(),
  classId: z.number().optional(),
  asset_category: AssetCategoryCreateInput.optional(),
  categoryId: z.number().optional(),
  asset_type: AssetTypeCreateInput.optional(),
  typeId: z.number().optional(),
})

export const ManagementCreateInput = z.object({
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
})

export const ModelEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  brand: z.string().optional(),
  number: z.string().optional(),

  asset_class: AssetClassCreateInput.optional(),
  assetClassId: z.number().optional(),
  asset_category: AssetCategoryCreateInput.optional(),
  assetCategoryId: z.number().optional(),
  asset_type: AssetTypeCreateInput.optional(),
  assetTypeId: z.number().optional(),
})
