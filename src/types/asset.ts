import { Department, Company, AssetManagement, Employee, AssetProject, Vendor, User, Model } from "@prisma/client"
import { AssetTypeTable } from "./generic"

export type ExcelExportAssetType =
  Partial<AssetTypeTable> &
  Partial<AssetManagement> &
  Partial<Model>




