import { z } from "zod"

export const LocationCreateInput = z.object({
  floor: z.string().optional(),
  room: z.string().optional(),
})

export const LocationEditInput = z.object({
  floor: z.string().optional(),
  room: z.string().optional(),
})
