import { z } from "zod"

export const AssetProjectCreateInput = z.object({
  name: z.string(),
})
