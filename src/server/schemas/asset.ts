import { z } from "zod"
import {
  ManagementCreateInput,
  ManagementEditInput,
  ModelCreateInput,
  ModelEditInput,
} from "./model"

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
  alt_number: z.string().optional(),
  serial_no: z.string().optional(),
  barcode: z.string().nullish().optional(),
  description: z.string().optional(),
  remarks: z.string().nullish().optional(),
  status: z.string().nullish().optional(),

  modelId: z.number().optional(),
  custodianId: z.number().optional(),
  departmentId: z.number().optional(),
  vendorId: z.number().optional(),
  subsidiaryId: z.number().optional(),
  projectId: z.number().optional(),
  parentId: z.number().optional(),
  management: ManagementEditInput.optional(),
  //model: ModelEditInput.optional(),
})

export const AssetUpdateInput = z.object({
  id: z.number(),
  name: z.string().min(1, "Please provide name"),
  number: z.string(),
  alt_number: z.string().optional(),
  serial_no: z.string().optional(),
  barcode: z.string().nullish().optional(),
  description: z.string().optional(),
  remarks: z.string().nullish().optional(),
  status: z.string().nullish().optional(),

  // modelId: z.number().optional(),
  // custodianId: z.number().optional(),
  // departmentId: z.number().optional(),
  vendorId: z.number(),
  // subsidiaryId: z.number().optional(),
  projectId: z.number(),
  parentId: z.number(),
  management: ManagementEditInput.optional(),
  model: ModelEditInput.optional(),
})

export const AssetDisposalCreateInput = z.object({
  disposalDate: z.date().default(new Date()),
  completionDate: z.date().default(new Date()),
  disposalStatus: z.string().default("pending"),
  departmentCode: z.string().nullish(),
  telephoneNo: z.string(),
  customerName: z.string(),
  salesAmount: z.number().optional(),
  salesInvoice: z.string(),
  apInvoice: z.string(),
  agreedPrice: z.number(),
  disposalPrice: z.number(),
  cufsCodeString: z.string().optional(),

  assetId: z.number(),
  disposalTypeId: z.number(),
})

export const AssetDisposalEditInput = z.object({
  id: z.number().optional(),
  disposalDate: z.date().optional(),
  completionDate: z.date().optional(),
  disposalStatus: z.string().optional(),
  departmentCode: z.string().optional(),
  telephoneNo: z.string().optional(),
  customerName: z.string().optional(),
  salesAmount: z.number().optional(),
  salesInvoice: z.string().optional(),
  apInvoice: z.string().optional(),
  agreedPrice: z.number().optional(),
  disposalPrice: z.number().optional(),
  cufsCodeString: z.string().optional(),

  assetId: z.number().optional(),
  asset: z
    .object({
      name: z.string().optional(),
      number: z.string().optional(),
    })
    .optional(),
  disposalType: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  disposalTypeId: z.number().optional(),
})

export const AssetRepairCreateInput = z.object({
  description: z.string().optional(),
  assetPart: z.string().optional(),
  notes: z.string().optional(),

  assetId: z.number().optional(),
})

export const AssetRepairEditInput = z.object({
  id: z.number(),
  description: z.string().optional(),
  assetPart: z.string().optional(),
  notes: z.string().optional(),

  assetId: z.number().optional(),
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
