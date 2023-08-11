import { z } from "zod"

export const initialIssuance = z.object({
    issuanceStatus: z.string().nullish(),
    issuanceDate: z.date().default(new Date()),
    assetId: z.number(),
    remarks: z.string(),
})

export const createIssuance = z.object({
    id: z.number(),
    issuanceStatus: z.string().nullish(),
    issuanceDate: z.date().default(new Date()),
    assetId: z.number(),
    remarks: z.string(),
})

export const returnAsset = z.object({
    id: z.number(),
    issuanceStatus: z.string().nullish(),
    pastIssuanceId: z.number().nullish(),
    returnedAt: z.date().default(new Date()),
    assetId: z.number(),
    remarks: z.string(),
})