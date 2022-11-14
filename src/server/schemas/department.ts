import { z } from "zod"
import { LocationCreateInput, LocationEditInput } from "./location"

export const DepartmentCreateInput = z.object({
  name: z.string(),
  location: LocationCreateInput.optional(),
  locationId: z.number().nullish(),
  companyId: z.number().nullish(),
})

export const DepartmentEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  location: LocationEditInput.optional(),
  locationId: z.number().optional(),
  companyId: z.number().optional(),
})
