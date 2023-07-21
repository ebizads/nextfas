import { z } from "zod"
import { BuildingCreateInput, BuildingEditInput } from "./building"
import { LocationCreateInput, LocationEditInput } from "./location"

export const DepartmentCreateInput = z.object({
  name: z.string(),
  location: LocationCreateInput.optional(),
  building: BuildingCreateInput.optional(),
  buildingId: z.number().nullish(),
  locationId: z.number().nullish(),
  companyId: z.number().nullish(),
})

export const DepartmentEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  location: LocationEditInput.optional(),
  building: BuildingEditInput.optional(),
  buildingId: z.number().optional(),
  locationId: z.number().optional(),
  companyId: z.number().optional(),
})
