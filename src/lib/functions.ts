import { AssetType, EmployeeType } from "../types/assets"
import * as XLSX from "xlsx"

export const getProperty = (filter: string, asset: AssetType) => {
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

export const getEmployeeProperty = (filter: string, emp: EmployeeType) => {
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
    Object.getOwnPropertyDescriptor(emp, filter)?.value ??
    Object.getOwnPropertyDescriptor(emp.profile, filter)?.value ??
    `asset[${filter}]`

  return property
}

export const downloadExcel = (data: EmployeeType[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "DataSheet.xlsx")
}
