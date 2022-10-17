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

export type AssetType = asset & {
  location: location | null
  type: type | null
  model: model | null
  category: category | null
  manufacturer: manufacturer | null
  vendor: vendor | null
  class: asset_class | null
  custodian: employee | null
}

export type EmployeeType = employee & {
  address: address | null
  profile: profile | null
  owned_assets: asset[]
}
