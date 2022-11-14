import { z } from "zod"
import { DepartmentCreateInput, DepartmentEditInput } from "./department"

export const TeamCreateInput = z.object({
  name: z.string(),
  department: DepartmentCreateInput.optional(),
  departmentId: z.number().nullish(),
})

export const TeamEditInput = z.object({
  name: z.string(),
  department: DepartmentEditInput.optional(),
  departmentId: z.number().nullish().optional(),
})
