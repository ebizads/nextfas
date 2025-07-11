import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"
import { DepartmentEditInput } from "./department"

export const EmployeeCreateInput = z.object({
  name: z.string().optional(),
  superviseeId: z.number().nullish().optional(),
  employee_id: z.string().nullish().optional(),
  // email: z
  //   .string()
  //   .regex(/.+\..+/, "Format invalid")
  //   .nullish()
  //   .optional(),
  email: z
    .string()
    .transform((val) => val.trim())
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
        })
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email format is invalid",
        })
      }
    }),
  // position: z.string().nullish().optional(),
  position: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Designation / Position is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Designation / Position is too short",
      })
    }
  }),
  profile: z
    .object({
      // first_name: z.string().min(1),
      first_name: z.string().superRefine((val, ctx) => {
        if (!val || val.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "First Name is required",
          })
        } else if (val.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            type: "string",
            minimum: 3,
            inclusive: true,
            message: "First name is too short",
          })
        }
      }),
      // last_name: z.string().min(1),
      last_name: z.string().superRefine((val, ctx) => {
        if (!val || val.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Last Name is required",
          })
        } else if (val.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            type: "string",
            minimum: 3,
            inclusive: true,
            message: "Last name is too short",
          })
        }
      }),
      middle_name: z.string().nullish().optional(),
      suffix: z.string().nullish().optional(),
      date_of_birth: z.date().nullish().optional(),
      phone_no: z.string().nullish().optional(),
      gender: z.string().nullish().optional(),
      image: z.string().nullish().optional(),
    })
    .optional(),
  address: AddressCreateInput,
  workStation: z.string().nullish(),
  workMode: z.string().nullish(),
})

export const EmployeeEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  superviseeId: z.number().nullish().optional(),
  employee_id: z.string().nullish().optional(),
  // email: z
  //   .string()
  //   .regex(/.+\..+/, "Format invalid")
  //   .nullish()
  //   .optional(),
  email: z
    .string()
    .transform((val) => val.trim())
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
        })
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email format is invalid",
        })
      }
    }),
  // position: z.string().nullish().optional(),
  position: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Designation / Position is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Designation / Position is too short",
      })
    }
  }),
  profile: z
    .object({
      // first_name: z.string().min(1),
      first_name: z.string().superRefine((val, ctx) => {
        if (!val || val.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "First Name is required",
          })
        } else if (val.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            type: "string",
            minimum: 3,
            inclusive: true,
            message: "First name is too short",
          })
        }
      }),
      // last_name: z.string().min(1),
      last_name: z.string().superRefine((val, ctx) => {
        if (!val || val.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Last Name is required",
          })
        } else if (val.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            type: "string",
            minimum: 3,
            inclusive: true,
            message: "Last name is too short",
          })
        }
      }),
      middle_name: z.string().nullish().optional(),
      suffix: z.string().nullish().optional(),
      date_of_birth: z.date().nullish().optional(),
      phone_no: z.string().nullish().optional(),
      gender: z.string().nullish().optional(),
      image: z.string().nullish().optional(),
    })
    .optional(),
  address: AddressEditInput,
  workStation: z.string().nullish(),
  workMode: z.string().nullish(),
  // teamId: z.number().nullish().optional(),
})
export const EmployeeTableEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  superviseeId: z.number().nullish().optional(),
  employee_id: z.string().nullish().optional(),
  // email: z
  //   .string()
  //   .regex(/.+\..+/, "Format invalid")
  //   .nullish()
  //   .optional(),
  email: z
    .string()
    .transform((val) => val.trim())
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
        })
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email format is invalid",
        })
      }
    }),
  // position: z.string().nullish().optional(),
  position: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Designation / Position is required",
      })
    } else if (val.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        type: "string",
        minimum: 5,
        inclusive: true,
        message: "Designation / Position is too short",
      })
    }
  }),
  profile: z.object({
    // first_name: z.string(),
    first_name: z.string().superRefine((val, ctx) => {
      if (!val || val.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "First Name is required",
        })
      } else if (val.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "string",
          minimum: 3,
          inclusive: true,
          message: "First name is too short",
        })
      }
    }),
    // last_name: z.string().min(1),
    last_name: z.string().superRefine((val, ctx) => {
      if (!val || val.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Last Name is required",
        })
      } else if (val.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "string",
          minimum: 3,
          inclusive: true,
          message: "Last name is too short",
        })
      }
    }),
    middle_name: z.string().nullish().optional(),
    suffix: z.string().nullish().optional(),
    date_of_birth: z.date().nullish().optional(),
    phone_no: z.string().nullish().optional(),
    gender: z.string().nullish().optional(),
    image: z.string().nullish().optional(),
  }),
  address: AddressEditInput,
  workStation: z.string().nullish(),
  workMode: z.string().nullish(),
  // teamId: z.number().optional(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
  deletedAt: z.date().nullish(),
  deleted: z.boolean(),
})

export const EmployeeDeleteInput = z.object({
  id: z.number(),
})
