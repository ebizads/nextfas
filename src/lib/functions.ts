import { AssetType } from "../types/assets"
import { EmployeeRowType } from "../types/table"

export const getProperty = (
  filter: string,
  asset: AssetType | EmployeeRowType
) => {
  //get object property
  // if (filter.includes("-")) {
  //   const arr = filter.split("-") as string[];
  //   console.log(asset);
  //   const obj =
  //     Object.getOwnPropertyDescriptor(asset, arr[0]!) ?? `asset[${filter}]`;
  //   // console.log(obj);
  //   return;
  // }
  const property =
    Object.getOwnPropertyDescriptor(asset, filter)?.value ?? `asset[${filter}]`
  return property
}
