import { z } from "zod"
export const BuildingCreateInput = z.object({
  name: z.string(),
})

export const BuildingEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),

})
