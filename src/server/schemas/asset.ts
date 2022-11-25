import { z } from "zod"
import {
  ManagementCreateInput,
  ManagementEditInput,
  ModelCreateInput,
  ModelEditInput,
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
  name: z.string().min(1, "Name is required"),
  number: z.string(),
  serial_no: z.string(),
  barcode: z.string(),
  description: z.string(),
  remarks: z.string(),

  model: ModelEditInput,
  custodianId: z.number().optional(),
  departmentId: z.number().optional(),
  vendorId: z.number().optional(),
  subsidiaryId: z.number().optional(),
  projectId: z.number().optional(),
  parentId: z.number().optional(),
  management: ManagementEditInput,
  subsidiary: SubsidiaryEditInput,
})
