import { z } from "zod"
import { ManagementCreateInput, ModelCreateInput } from "./model"

export const AssetCreateInput = z.object({
  name: z.string().min(1, "Please provide name"),
  number: z.string(),
  alt_number: z.string().nullish(),
  serial_no: z.string().nullish(),
  barcode: z.string().nullish(),
  description: z.string().nullish(),
  remarks: z.string().nullish(),

  model: ModelCreateInput,
  custodianId: z.number().optional(),
  departmentId: z.number({ required_error: "Please provide a department" }),
  vendorId: z.number().optional(),
  subsidiaryId: z.number({
    required_error: "Please provide a company/subsidiary",
  }),
  projectId: z.number().optional(),
  parentId: z.number().optional(),
  addedById: z.number().optional(),
  management: ManagementCreateInput,
})

export const AssetEditInput = z.object({
  id: z.number(),
  name: z.string().min(1, "Please provide name"),
  number: z.string(),
  alt_number: z.string().nullish(),
  serial_no: z.string().nullish(),
  barcode: z.string().nullish(),
  description: z.string().nullish(),
  remarks: z.string().nullish(),

  modelId: z.number().optional().nullish(),
  custodianId: z.number().optional().nullish(),
  departmentId: z.number().optional().nullish(),
  vendorId: z.number().optional().nullish(),
  subsidiaryId: z.number().optional().nullish(),
  assetProjectId: z.number().optional().nullish(),
  parentId: z.number().optional().nullish(),

  //management: ManagementEditInput.optional(),
})

export const AssetDisposalCreateInput = z.object({
  disposalDate: z.date().optional(),
  disposalStatus: z.string().optional(),
  departmentCode: z.string().optional(),
  customerName: z.string().optional(),
  salesAmount: z.number().optional(),
  salesInvoice: z.string().optional(),
  agreedPrice: z.number().optional(),
  cufsCodeString: z.string().optional(),

  assetId: z.number().optional(),
  disposalTypeId: z.number().optional(),
})

export const AssetDisposalEditInput = z.object({
  id: z.number(),
  disposalDate: z.date().optional(),
  disposalStatus: z.string().optional(),
  departmentCode: z.string().optional(),
  customerName: z.string().optional(),
  salesAmount: z.number().optional(),
  salesInvoice: z.string().optional(),
  agreedPrice: z.number().optional(),
  cufsCodeString: z.string().optional(),

  assetId: z.number().optional(),
  disposalTypeId: z.number().optional(),
})
// export const AssetEditKevinInput = z.object({
//   id: z.number(),
//   name: z.string().min(1, "Please provide name"),
//   number: z.string(),
//   alt_number: z.string().nullish(),
//   serial_no: z.string().nullish(),
//   barcode: z.string().nullish(),
//   description: z.string().nullish(),
//   remarks: z.string().nullish(),
//   departmentId: z.number().optional().nullish(),
// })
