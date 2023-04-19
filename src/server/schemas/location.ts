import { z } from "zod"

export const LocationCreateInput = z.object({
  assetLocation: z.string().optional(),
  floor: z.string().optional(),
  room: z.string().optional(),
})

export const LocationEditInput = z.object({
  assetLocation: z.string().optional(),
  floor: z.string().optional(),
  room: z.string().optional(),
})
