import { inferProcedureOutput } from "@trpc/server"
import { z } from "zod"
import {
  AssetCreateInput,
  AssetTransferCreateInput,
  AssetUpdateInput,
} from "../server/schemas/asset"
import { EmployeeCreateInput } from "../server/schemas/employee"
import { AppRouter } from "../server/trpc/router"

//dynamic inference of type
export type AssetType = inferProcedureOutput<AppRouter["assetType"]["findOne"]>
export type Asset = inferProcedureOutput<AppRouter["asset"]["findOne"]>
export type AssetTypeTable = inferProcedureOutput<
  AppRouter["asset"]["findOneTable"]
>
export type AssetTypeDashboard = inferProcedureOutput<
  AppRouter["assetType"]["findOneDashboard"]
>

export type AssetActionType = inferProcedureOutput<
  AppRouter["assetActionType"]["findOne"]
>

export type AssetDevice = inferProcedureOutput<
  AppRouter["assetType"]["findOne"]
>

export type BuildingType = inferProcedureOutput<
  AppRouter["building"]["findOne"]
>

export type DepartmentType = inferProcedureOutput<
  AppRouter["department"]["findOne"]
>

export type EmployeeType = inferProcedureOutput<
  AppRouter["employee"]["findOne"]
>

//employee field types
export type EmployeeFieldValues = z.infer<typeof EmployeeCreateInput>

//asset field types
export type AssetFieldValues = z.infer<typeof AssetCreateInput>
export type AssetTransferValues = z.infer<typeof AssetTransferCreateInput>
export type AssetEditFieldValues = z.infer<typeof AssetUpdateInput>

export type UserType = inferProcedureOutput<AppRouter["user"]["findOne"]>
