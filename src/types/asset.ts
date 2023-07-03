import { Department, Model, Company, AssetManagement } from "@prisma/client"
import { AssetType } from "./generic"

export type ExcelExportAssetType =
  Partial<AssetType> &
  Partial<AssetManagement> &
  Partial<Department> &
  Partial<Company> &
  Partial<Model>




