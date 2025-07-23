import { AssetTypeTable } from "./generic"

export type ExcelExportAssetType = Partial<AssetTypeTable>
export type ExcelAssetCheckerType = Partial<{
  id: number | undefined
  name: string
  asset_number: string
  serial_no: string
  brand: string
  type: string
  caliber: string
  models: string
  action_type: string
  description: string
}>
