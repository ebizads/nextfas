import {
  address,
  asset,
  asset_class,
  category,
  employee,
  location,
  manufacturer,
  model,
  profile,
  type,
  vendor,
} from "@prisma/client"
import { inferProcedureOutput } from "@trpc/server"
import { AppRouter } from "../server/trpc/router"


//dynamic inference of type
export type AssetType = inferProcedureOutput<AppRouter["asset"]["findOne"]>
export type VendorType = inferProcedureOutput<AppRouter["vendor"]["findOne"]>
