import { AssetType, VendorType } from "../types/generic"
import { EmployeeRowType } from "../types/table"
import * as XLSX from "xlsx"
import { ExcelExportType } from "../types/employee"

export const getProperty = (
  filter: string,
  asset: AssetType | EmployeeRowType | VendorType
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
    Object.getOwnPropertyDescriptor(asset, filter)?.value ?? `attr[${filter}]`
  return property
}

export const formatBytes = (bytes: number) => {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = 2
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const downloadExcel = (data: ExcelExportType[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "DataSheet.xlsx")
}
