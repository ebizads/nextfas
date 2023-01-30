import { z } from "zod"
import { IdUser } from "./user"

export const ticketTableCreate = z.object({
  tableName: z.string().nullish(),
  tableId: z.number().nullish(),
  action: z.string().nullish(),
  oldData: z.string().nullish(),
  newData: z.string().nullish(),
  modifiedById: z.number().nullish(),
  modifiedBy: IdUser.nullish(),
})
