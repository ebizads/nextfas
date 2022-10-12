import {
  asset,
  asset_class,
  category,
  employee,
  location,
  manufacturer,
  model,
  supplier,
  type,
  vendor,
} from "@prisma/client";

export type AssetType = asset & {
  location: location | null;
  type: type | null;
  model: model | null;
  category: category | null;
  supplier: supplier | null;
  manufacturer: manufacturer | null;
  vendor: vendor | null;
  class: asset_class | null;
  custodian: employee | null;
};
