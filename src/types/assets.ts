import {
  asset,
  asset_class,
  category,
  employee,
  location,
  manufacturer,
  model,
  type,
  vendor,
} from "@prisma/client"
import { inferProcedureOutput } from "@trpc/server"
import { AppRouter } from "../server/trpc/router"

//dynamic inference of type
export type AssetType = inferProcedureOutput<AppRouter["asset"]["findOne"]>
