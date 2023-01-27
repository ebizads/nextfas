import { z } from "zod"
import { IdUser } from "./user"

export const ticketTableCreate = z.object({
  from_table: z.string(),
  table_id: z.number().nullish(),
  action_type: z.string().nullish(),
  action_desc: z.string().nullish(),
  addedById: z.number().nullish(),
  addedBy: IdUser,
})
