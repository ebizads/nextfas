import { z } from "zod"

export const AssetActionTypeCreateInput = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export type AssetActionTypeCreateInput = z.infer<typeof AssetActionTypeCreateInput>