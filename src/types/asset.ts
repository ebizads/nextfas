import { Department, Model, Company, AssetManagement, Employee, AssetProject, Vendor, User } from "@prisma/client"
import { AssetType } from "./generic"

export type ExcelExportAssetType =
  Partial<AssetType> &
  Partial<AssetManagement>




