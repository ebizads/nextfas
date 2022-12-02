import { z } from "zod"
import {
  ManagementCreateInput,
  ManagementEditInput,
  ModelCreateInput,
  SubsidiaryEditInput,
} from "./model"

export const AssetCreateInput = z.object({
  name: z.string().min(1, "Please provide name"),
  number: z.string().nullish(),
  alt_number: z.string().nullish(),
  serial_no: z.string().nullish(),
  barcode: z.string().nullish(),
  description: z.string().nullish(),
  remarks: z.string().nullish(),

  model: ModelCreateInput,
  custodianId: z.number().optional(),
  departmentId: z.number().optional(),
  vendorId: z.number().optional(),
  subsidiaryId: z.number().optional(),
  projectId: z.number().optional(),
  parentId: z.number().optional(),
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
