import { z } from "zod"
import { AddressCreateInput, AddressEditInput } from "./address"

export const CreateUserInput = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  // email: z.string({ required_error: "Email is required" }).email().min(1),
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
  username: z
    .string()
    .transform((val) => val.trim())
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Username is required",
        })
      }
    }),
  password: z.string(),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{1,}$/,
  //   {
  //     message: "Password does not match the given restrictions",
  //   }
  // )
  // .min(12, { message: "Password should be at least 12 characters" })
  // .max(20, { message: "Password should not be more than 20 characters" }),
  oldPassword: z.array(z.string()).optional().default([]),
  user_type: z.string().nullish(),
  image: z.string().nullish(),
  firstLogin: z.boolean().nullish(),
  validateTable: z.object({
    certificate: z.string().nullish(),
    validationDate: z.date().nullish(),
  }),
  profile: z.object({
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
    middle_name: z.string().nullish(),
    suffix: z.string().nullish(),
    date_of_birth: z.date().nullish(),
    phone_no: z.string().nullish(),
    gender: z.string().nullish(),
    image: z.string().nullish(),
  }),
  user_Id: z.string().nullish(),
  inactivityDate: z.date().nullish(),
  passwordAge: z.date().nullish(),
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
  address: AddressCreateInput,
  // teamId: z.number({ required_error: "Team is required" }),
})

export const CreateArchiveUser = z.object({
  name: z.string().optional().nullish(),
  email: z.string().email().optional().nullish(),
  user_Id: z.string().nullish(),
  position: z.string().optional().nullish(),
  old_id: z.number().optional(),
  teamId: z.number().nullish(),
})
export const ChangeUserPass = z.object({
  id: z.number(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{1,}$/,
      {
        message: "Password does not match the given restrictions",
      }
    )
    .min(12, { message: "Password should be at least 12 characters" })
    .max(20, { message: "Password should not be more than 20 characters" }),
  oldPassword: z.array(z.string()).optional().default([]),
  passwordAge: z.date().nullish(),
  firstLogin: z.boolean().nullish(),
})

export const EditUserInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  // email: z.string().optional(),
  username: z
    .string()
    .transform((val) => val.trim())
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Username is required",
        })
      }
    }),
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
  user_type: z.string().nullish(),
  image: z.string().nullish(),
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
      middle_name: z.string().nullish(),
      suffix: z.string().nullish(),
      date_of_birth: z.date().nullish(),
      phone_no: z.string().nullish(),
      gender: z.string().nullish(),
      image: z.string().nullish(),
    })
    .optional(),
  validateTable: z
    .object({
      certificate: z.string().nullish(),
      validationDate: z.date().nullish(),
    })
    .optional(),
  passwordAge: z.date().nullish(),
  // position: z.string().nullish(),
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
  address: AddressEditInput,
  inactivityDate: z.date().nullish(),
  lockedAt: z.date().nullish(),
  lockedUntil: z.date().nullish(),
  attempts: z.number().nullish(),
  lockedReason: z.string().nullish(),
  user_Id: z.string().nullish().optional(),
})

export const IdUser = z.object({
  id: z.number(),
})
