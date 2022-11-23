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
  number: z.string(),
  alt_number: z.string(),
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
  id: z.number().nullish(),
  name: z.string().min(1, "Name is required"),
  number: z.string().nullish(),
  serial_no: z.string().nullish(),
  barcode: z.string().nullish(),
  description: z.string().nullish(),
  remarks: z.string().nullish(),

  model: ModelEditInput,
  custodianId: z.number().optional().nullish(),
  departmentId: z.number().optional().nullish(),
  vendorId: z.number().optional().nullish(),
  subsidiaryId: z.number().optional().nullish(),
  projectId: z.number().optional().nullish(),
  parentId: z.number().optional().nullish(),
  management: ManagementEditInput,
  subsidiary: SubsidiaryEditInput,
})
