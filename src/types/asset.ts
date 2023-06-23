import { Asset, Department, User, Vendor, AssetProject, Employee, Model, Company, AssetDisposal, AssetManagement, AssetRepair, AssetTransfer } from "@prisma/client"
import { AssetType } from "./generic"

export type ExcelExportAssetType =
  Partial<AssetType> &
  Partial<Department> &
  Partial<Vendor> &
  Partial<User> &
  Partial<AssetProject> &
  Partial<Employee> &
  Partial<Model> &
  Partial<Asset> &
  Partial<Company> &
  Partial<AssetDisposal> &
  Partial<AssetManagement> &
  Partial<AssetRepair> &
  Partial<AssetTransfer>



