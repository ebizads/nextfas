import { z } from "zod"

export const AssetTypeCreateInput = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export type AssetTypeCreateInput = z.infer<typeof AssetTypeCreateInput>