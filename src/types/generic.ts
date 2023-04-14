import { ticketTableCreate } from "./../server/schemas/ticket"
import { inferProcedureOutput } from "@trpc/server"
import { z } from "zod"
import {
  AssetCreateInput,
  AssetEditInput,
  AssetUpdateInput,
  AssetOnlyInput
} from "../server/schemas/asset"
import { EmployeeCreateInput } from "../server/schemas/employee"
import { AppRouter } from "../server/trpc/router"

//dynamic inference of type
export type AssetType = inferProcedureOutput<AppRouter["asset"]["findOne"]>
export type AssetRepairType = inferProcedureOutput<
  AppRouter["assetRepair"]["findOne"]
>
export type AssetClassType = inferProcedureOutput<
  AppRouter["assetClass"]["findOne"]
>
export type DepartmentType = inferProcedureOutput<
  AppRouter["department"]["findOne"]
>

export type VendorType = inferProcedureOutput<AppRouter["vendor"]["findOne"]>
export type EmployeeType = inferProcedureOutput<
  AppRouter["employee"]["findOne"]
>

export type DisposeType = inferProcedureOutput<
  AppRouter["assetDisposal"]["findOne"]
>

//employee field types
export type EmployeeFieldValues = z.infer<typeof EmployeeCreateInput>

//asset field types
export type AssetFieldValues = z.infer<typeof AssetCreateInput>
export type AssetFieldnPurchase = z.infer<typeof AssetOnlyInput>
export type AssetEditFieldValues = z.infer<typeof AssetUpdateInput>
export type TicketHandlerValues = z.infer<typeof ticketTableCreate>

export type UserType = inferProcedureOutput<AppRouter["user"]["findOne"]>
// export type ModelFieldValues = z.infer<typeof ModelCreateInput>
// // export type ManagementFieldValues = z.infer<typeof ManagementCreateInput>

// export type Join<K, P> = K extends string | number
//   ? P extends string | number
//     ? `${K}${"" extends P ? "" : "."}${P}`
//     : never
//   : never

// type Prev = [
//   never,
//   0,
//   1,
//   2,
//   3,
//   4,
//   5,
//   6,
//   7,
//   8,
//   9,
//   10,
//   11,
//   12,
//   13,
//   14,
//   15,
//   16,
//   17,
//   18,
//   19,
//   20,
//   ...0[]
// ]

// type Mdl<T, D extends number = 10> = [D] extends [never]
//   ? never
//   : T extends object
//   ? {
//       [K in keyof T]-?: K extends string | number
//         ? `${K}` | Join<K, Mdl<T[K], Prev[D]>>
//         : never
//     }[keyof T]
//   : ""

// type Mngmt<T, D extends number = 10> = [D] extends [never]
//   ? never
//   : T extends object
//   ? { [K in keyof T]-?: Join<K, Mngmt<T[K], Prev[D]>> }[keyof T]
//   : ""

// export type AssetFieldValues = Mngmt<InitialAssetFieldValues>
