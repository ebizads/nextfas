import { z } from "zod"

export const initialIssuance = z.object({
  issuanceStatus: z.string().nullish(),
  issuanceDate: z.date().default(new Date()).nullish(),
  remarks: z.string().nullish(),
  assetId: z.number().optional(),
  // deleted: z.boolean().default(false).optional().nullish(),
})

export const createIssuance = z.object({
  id: z.number().optional(),
  issuanceStatus: z.string().nullish().optional(),
  issuanceDate: z.date().default(new Date()).nullish(),
  assetId: z.number().optional().nullish(),
  remarks: z.string().optional().nullish(),
  deleted: z.boolean().optional(),
})

export const returnAsset = z.object({
  id: z.number(),
  issuanceStatus: z.string().nullish(),
  pastIssuanceId: z.number().nullish(),
  returnedAt: z.date().default(new Date()),
  assetId: z.number(),
  remarks: z.string(),
})
