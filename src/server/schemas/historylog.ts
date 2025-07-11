import { z } from "zod"

export const AssetCreateInput = z.object({
    name: z.string().min(1, "Please Provide Asset Name"),
    alt_number: z.string().nullish(),
    serial_no: z.string().nullish(),
    barcode: z.string().nullish(),
    description: z.string().nullish(),
    remarks: z.string().nullish(),
    brand: z.string().nullish(),
    typeId: z.number(),
    actionTypeId: z.number(),
    caliber: z.string().nullish(),
    models: z.string().nullish(),
    invoiceNum: z.string().nullish(),
    purchaseOrder: z.string().nullish(),
    deployment_status: z.string().nullish(),
})