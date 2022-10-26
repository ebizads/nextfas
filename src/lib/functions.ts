import { AssetType, VendorType } from "../types/generic"
import { EmployeeRowType } from "../types/table"
import * as XLSX from "xlsx"
import { ExcelExportType } from "../types/employee"

export const getProperty = (
  filter: string,
  type: AssetType | EmployeeRowType | VendorType
) => {
  //get object property
  const obj = Object.getOwnPropertyDescriptor(type, filter)?.value

  //returns the actual property as string
  if (typeof obj === "string") return obj as string
  return obj ? Object.getOwnPropertyDescriptor(obj, "name")?.value : "No Value"

  // if (typeof type?.[filter as keyof typeof type] === "object") {
  //   return (
  //     (
  //       type?.[filter as keyof typeof type] as unknown as Record<
  //         string,
  //         unknown
  //       >
  //     )?.name ?? "No value"
  //   )
  // }

  // return type?.[filter as keyof typeof type] ?? "No value"
}

export const formatBytes = (bytes: number) => {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = 2
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const downloadExcel = (data: ExcelExportType[] | null) => {
  if (!data) {
    // csv null fall back
    const worksheet = XLSX.utils.json_to_sheet(data ?? [])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx")
  }

  return
}
