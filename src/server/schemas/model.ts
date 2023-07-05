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

export const CustodianEditInput = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullish(),
})

export const DepartmentEditInput = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullish(),
})

export const VendorEditInput = z.object({
  id: z.number(),
  name: z.string().optional().nullish(),
})

export const ProjectEditInput = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullish(),
})

export const ParentEditInput = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullish(),
})

export const ModelCreateInput = z.object({
  name: z.string(),
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
  id: z.number(),
  name: z.string(),
  brand: z.string().optional(),
  number: z.string().optional(),

  // asset_class: AssetClassCreateInput
  classId: z.number({ required_error: "Please select asset class" }),
  //asset_category: AssetCategoryCreateInput,
  categoryId: z.number({ required_error: "Please select asset category" }),
  //asset_type: AssetTypeCreateInput,
  typeId: z.number({ required_error: "Please select asset type" }),
  //type: TypeEditInput.optional(),
})
export const ModelEditTableInput = z.object({
  id: z.number(),
  name: z.string(),
  brand: z.string().optional(),
  number: z.string().optional(),

  // asset_class: AssetClassCreateInput
  classId: z.number({ required_error: "Please select asset class" }),
  //asset_category: AssetCategoryCreateInput,
  categoryId: z.number({ required_error: "Please select asset category" }),
  //asset_type: AssetTypeCreateInput,
  typeId: z.number({ required_error: "Please select asset type" }),
  //type: TypeEditInput.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  deleted: z.boolean(),

})

export const ManagementCreateInput = z.object({
  currency: z.string().optional().nullish(),
  original_cost: z.number().optional().nullish(),
  current_cost: z.number().optional().nullish(),
  residual_value: z.number().nullish().nullish(),
  residual_percentage: z.number({ required_error: "Cost" }),
  purchase_date: z.date().nullish(),

  depreciation_start: z.date().nullish(),
  depreciation_end: z.date().nullish(),
  depreciation_status: z.string().nullish(),
  depreciation_period: z.number().nullish(),
  depreciation_lifetime: z.number().nullish(),
  depreciation_rule: z.string().nullish(),
  asset_lifetime: z.number().nullish(),
  asset_quantity: z.number().nullish(),
  asset_location: z.string().nullish(),
  accounting_method: z.string().nullish(),
  remarks: z.string().nullish(),
  // id: z.number(),
})

export const ManagementEditInput = z.object({
  id: z.number(),
  currency: z.string().optional().nullish(),
  original_cost: z.number().optional().nullish(),
  current_cost: z.number().optional().nullish(),
  residual_value: z.number().nullish(),
  residual_percentage: z.number().nullish(),
  purchase_date: z.date().nullish(),

  depreciation_start: z.date().nullish(),
  depreciation_end: z.date().nullish(),
  depreciation_status: z.string().nullish(),
  depreciation_period: z.number().nullish(),
  depreciation_lifetime: z.number().nullish(),
  depreciation_rule: z.string().nullish(),
  asset_lifetime: z.number().nullish(),
  asset_quantity: z.number().nullish(),
  asset_location: z.string().nullish(),
  accounting_method: z.string().nullish(),
  remarks: z.string().nullish(),
})

export const ManagementTableEditInput = z.object({
  id: z.number(),
  currency: z.string().optional().nullish(),
  original_cost: z.number().optional().nullish(),
  current_cost: z.number().optional().nullish(),
  residual_value: z.number().nullish(),
  residual_percentage: z.number().nullish(),
  purchase_date: z.date().nullish(),

  assetId: z.number(),
  depreciation_start: z.date().nullish(),
  depreciation_end: z.date().nullish(),
  depreciation_status: z.string().nullish(),
  depreciation_period: z.number().nullish(),
  depreciation_lifetime: z.number().nullish(),
  depreciation_rule: z.string().nullish(),
  asset_lifetime: z.number().nullish(),
  asset_quantity: z.number().nullish(),
  asset_location: z.string().nullish(),
  accounting_method: z.string().nullish(),
  remarks: z.string().nullish(),
})