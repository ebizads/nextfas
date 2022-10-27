import { inferProcedureOutput } from "@trpc/server"
import { AppRouter } from "../server/trpc/router"

//dynamic inference of type
export type AssetType = inferProcedureOutput<AppRouter["asset"]["findOne"]>
export type VendorType = inferProcedureOutput<AppRouter["vendor"]["findOne"]>
export type EmployeeType = inferProcedureOutput<
  AppRouter["employee"]["findOne"]
>
