import { Department, Model, Company, AssetManagement, Asset_Category, Asset_Type, Asset_Class } from "@prisma/client"
import { AssetType } from "./generic"

export type ExcelExportAssetType =
  Partial<AssetType> &
  Partial<AssetManagement> &
  Partial<Department> &
  Partial<Company> &
  Partial<Model> &
  Partial<Asset_Category> &
  Partial<Asset_Type> &
  Partial<Asset_Class>




