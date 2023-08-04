import { z } from "zod"

export const initialIssuance = z.object({
    issuedById: z.number(),
    issuedToId: z.number().nullish(),
    issuanceStatus: z.string().nullish(),
    issuanceDate: z.date().default(new Date()),
    assetId: z.number(),
    remarks: z.string(),
})

export const createIssuance = z.object({
    id: z.number(),
    issuedById: z.number(),
    issuedToId: z.number(),
    issuanceStatus: z.string(),
    issuanceDate: z.date().default(new Date()),
    assetId: z.number(),
    remarks: z.string(),
})

export const returnAsset = z.object({
    id: z.number(),
    issuedToId: z.number().nullish(),
    issuedById: z.number().nullish(),
    issuanceStatus: z.string().nullish(),
    pastIssuanceId: z.number().nullish(),
    returnedAt: z.date().default(new Date()),
    assetId: z.number(),
    remarks: z.string(),
})