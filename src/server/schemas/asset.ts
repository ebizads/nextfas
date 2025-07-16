import { z } from "zod"
import { createIssuance } from "./issuance"

//only creates Assets
// export const AssetOnlyInput = z.object({
//   name: z.string().min(1, "Asset Name is required"),
//   number: z.string(),
//   alt_number: z.string().nullish(),
//   serial_no: z.string().nullish(),
//   barcode: z.string().nullish(),
//   description: z.string().nullish(),
//   remarks: z.string().nullish(),
// })

export const AssetCreateInput = z.object({
  // name: z.string().min(1, "Asset Name is required"),
  name: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Asset Name is required",
      })
    } else if (val.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 6,
        inclusive: true,
        message: "Asset name is too short",
      })
    }
  }),
  alt_number: z.string().nullish(),
  serial_no: z.string().nullish(),
  // barcode: z.string().nullish(),
  barcode: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RFID Tag ID / Barcode is required",
      })
    } else if (val.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 8,
        inclusive: true,
        message: "RFID Tag ID / Barcode is too short",
      })
    }
  }),
  description: z.string().nullish(),
  remarks: z.string().nullish(),
  // brand: z.string().nullish(),
  brand: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Brand is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Brand is too short",
      })
    }
  }),
  // typeId: z.number(),
  // actionTypeId: z.number(),
  typeId: z.number({
    required_error: "Type is required",
    invalid_type_error: "Type must be a number",
  }),

  actionTypeId: z.number({
    required_error: "Action Type is required",
    invalid_type_error: "Action type must be a number",
  }),
  // caliber: z.string().nullish(),
  caliber: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Caliber is required",
      })
    } else if (val.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 3,
        inclusive: true,
        message: "Caliber is too short",
      })
    }
  }),
  // models: z.string().min(1, "Model is required"),
  models: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Model is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Model is too short",
      })
    }
  }),
  invoiceNum: z.string().nullish(),
  purchaseOrder: z.string().nullish(),
  deployment_status: z.string().nullish(),
})

export const AssetEditInput = z.object({
  id: z.number(),
  // name: z.string().min(1, "Asset Name is required").optional(),
  name: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Asset Name is required",
      })
    } else if (val.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 6,
        inclusive: true,
        message: "Asset name is too short",
      })
    }
  }),
  number: z.string().optional(),
  serial_no: z.string().optional().nullish(),
  // barcode: z.string().nullish().optional(),
  barcode: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RFID Tag ID / Barcode is required",
      })
    } else if (val.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 8,
        inclusive: true,
        message: "RFID Tag ID / Barcode is too short",
      })
    }
  }),
  description: z.string().optional().nullish(),
  // brand: z.string().nullish(),
  brand: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Brand is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Brand is too short",
      })
    }
  }), // type: z.string(),
  // action_type: z.string().nullish(),
  // typeId: z.number({
  //   required_error: "Type is required",
  //   invalid_type_error: "Type must be a number",
  // }),

  // actionTypeId: z.number({
  //   required_error: "Action Type is required",
  //   invalid_type_error: "Action type must be a number",
  // }),
  type: z.string({
    required_error: "Type is required",
    invalid_type_error: "Type must be a String",
  }),
  action_type: z.string().nullish(),
  // caliber: z.string().nullish(),
  caliber: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Caliber is required",
      })
    } else if (val.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 3,
        inclusive: true,
        message: "Caliber is too short",
      })
    }
  }),
  // models: z.string().min(1, "Model is required"),
  models: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Model is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Model is too short",
      })
    }
  }),

  // pastIssuanceId: z.number().nullish(),
  // issuedById: z.number().optional().nullish(),
  // issuedToId: z.number().optional().nullish(),
  // issuance: createIssuance.optional()
  // model: ModelEditInput.optional(),
})

export const AssetTransformInput = z.object({
  // name: z.string().min(1, "Asset Name is required"),
  name: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Asset Name is required",
      })
    } else if (val.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 6,
        inclusive: true,
        message: "Asset name is too short",
      })
    }
  }),
  serial_no: z.string().nullish(),
  // barcode: z.string(),
  barcode: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RFID Tag ID / Barcode is required",
      })
    } else if (val.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 8,
        inclusive: true,
        message: "RFID Tag ID / Barcode is too short",
      })
    }
  }),
  number: z.string().optional(),
  // brand: z.string(),
  brand: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Brand is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Brand is too short",
      })
    }
  }),
  type: z.string(),
  action_type: z.string(),
  // typeId: z.number({
  //   required_error: "Type is required",
  //   invalid_type_error: "Type must be a number",
  // }),

  // actionTypeId: z.number({
  //   required_error: "Action Type is required",
  //   invalid_type_error: "Action type must be a number",
  // }),
  // caliber: z.string(),
  caliber: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Caliber is required",
      })
    } else if (val.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 3,
        inclusive: true,
        message: "Caliber is too short",
      })
    }
  }),
  // models: z.string(),
  models: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Model is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Model is too short",
      })
    }
  }),
  status: z.string().nullish(),
  description: z.string().nullish(),
  // createdAt: z.date(),
  // updatedAt: z.date(),,

  // assetTagId: z.number(),
  // modelId: z.number(),
  // custodianId: z.number().nullish(),
  // issuance: createIssuance
})

export const AssetUpdateInput = z.object({
  id: z.number(),
  // name: z.string().min(3, "Asset Name is required"),
  name: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Asset Name is required",
      })
    } else if (val.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 6,
        inclusive: true,
        message: "Asset name is is too short",
      })
    }
  }),
  number: z.string(),
  alt_number: z.string().nullish(),
  serial_no: z.string().nullish(),
  // barcode: z.string().min(3, "RFID Tag ID / Barcode is required"),
  barcode: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RFID Tag ID / Barcode is required",
      })
    } else if (val.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 8,
        inclusive: true,
        message: "RFID Tag ID / Barcode is too short",
      })
    }
  }),
  description: z.string().nullish(),
  remarks: z.string().nullish(),
  // brand: z.string().min(1, "Brand is required"),
  brand: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Brand is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Brand is too short",
      })
    }
  }),
  // typeId: z.number(),
  // actionTypeId: z.number(),
  typeId: z.number({
    required_error: "Type is required",
    invalid_type_error: "Invalid type",
  }),

  actionTypeId: z.number({
    required_error: "Action Type is required",
    invalid_type_error: "Invalid action type",
  }),

  // caliber: z.string().min(1, "Caliber is required"),
  caliber: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Caliber is required",
      })
    } else if (val.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 3,
        inclusive: true,
        message: "Caliber is too short",
      })
    }
  }),
  // models: z.string().min(1, "Model is required"),
  models: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Model is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Model is too short",
      })
    }
  }),
  status: z.string().nullish(),
  // invoiceNum: z.string().nullish(),
  // purchaseOrder: z.string().nullish(),
  // deployment_status: z.string().nullish(),

  // modelId: z.number(),
  // custodianId: z.number().nullish(),
  // departmentId: z.number().nullish(),
  // vendorId: z.number().nullish(),
  // subsidiaryId: z.number().nullish(),
  // assetProjectId: z.number().nullish(),
  // parentId: z.number().nullish(),
  // assetTagId: z.number().optional(),
  // management: ManagementEditInput,
  // model: ModelEditInput,
  // AssetIssuance: createIssuance,
})

export const AssetDisposalCreateInput = z.object({
  disposalDate: z.date().default(new Date()),
  disposalStatus: z.string().default("pending"),
  departmentCode: z.string().nullish(),
  telephoneNo: z.string(),
  customerName: z.string(),
  salesAmount: z.number().optional(),
  salesInvoice: z.string(),
  apInvoice: z.string(),
  agreedPrice: z.number(),
  disposalPrice: z.number(),

  tradedItem: z.string(),
  assetId: z.number(),
  disposalTypeId: z.number(),
})

export const AssetDisposalEditInput = z.object({
  id: z.number().optional(),
  disposalDate: z.date().optional(),
  disposalStatus: z.string().optional(),
  departmentCode: z.string().optional(),
  telephoneNo: z.string().optional(),
  customerName: z.string().optional(),
  salesAmount: z.number().optional(),
  salesInvoice: z.string().optional(),
  apInvoice: z.string().optional(),
  agreedPrice: z.number().optional(),
  disposalPrice: z.number().optional(),
  // cufsCodeString: z.string().optional(),
  remarks: z.string().optional(),

  assetId: z.number().nullish().optional(),
  // asset: z
  //   .object({
  //     name: z.string().optional(),
  //     number: z.string().optional(),
  //   })
  //   .optional(),
  // disposalType: z
  //   .object({
  //     name: z.string().optional(),
  //   })
  //   .optional(),
  disposalTypeId: z.number().optional(),
})

export const AssetTransferCreateInput = z.object({
  transferDate: z.date().default(new Date()).nullish().optional(),
  transferStatus: z.string().default("pending"),
  transferLocation: z.string().optional(),
  departmentCode: z.string().nullish(),
  remarks: z.string().optional(),
  custodianId: z.number().optional(),
  assetId: z.number().optional(),
})

export const AssetTransferEditInput = z.object({
  id: z.number().optional(),
  transferDate: z.date().nullish(),
  transferStatus: z.string().optional(),
  transferLocation: z.string().optional(),
  departmentCode: z.string().nullish().optional(),
  remarks: z.string().nullish().optional(),
  custodianId: z.number().optional(),
  assetId: z.number().optional(),
  issuance: createIssuance,
})

export const AssetRepairCreateInput = z.object({
  description: z.string().optional().nullish(),
  assetPart: z.string().min(1, "Please provide the part"),
  notes: z.string().min(1, "Please provide a not for repair"),
  assetId: z.number().optional(),
  repairStatus: z.string().optional(),
})

export const AssetRepairEditInput = z.object({
  id: z.number().optional(),
  description: z.string().optional(),
  assetPart: z.string().optional(),
  notes: z.string().optional(),
  remarks: z.string().optional(),
  repairStatus: z.string().optional(),

  assetId: z.number().optional(),
})

export const HistoryLogCreateInput = z.object({
  gunNumber: z.string().optional(),
  participant: z.string().optional(),
  action: z.string().optional(),
})
