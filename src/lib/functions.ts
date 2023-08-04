import {
  AssetRepairType,
  AssetTransferType,
  AssetType,
  DisposeType,
  EmployeeType,
  UserType,
  VendorType,
  AssetTag,
  DepartmentType,
  BuildingType,
  AssetDevice,
  IssuanceType,
} from "../types/generic"
import * as XLSX from "xlsx"
import { ExcelExportType } from "../types/employee"
import { Address, Company, assetTag, Model } from "@prisma/client"
import Router from "next/router"
import { object } from "zod"
import { trpc } from "../utils/trpc"
import { useState } from "react"
import { ExcelExportTypeVendor } from "../types/vendors"
import { ExcelExportAssetType } from "../types/asset"

const router = Router
export const getProperty = (
  filter: string,
  type:
    | AssetType
    | EmployeeType
    | VendorType
    | DisposeType
    | AssetRepairType
    | UserType
    | AssetTransferType
    | AssetTag
    | AssetDevice
  //subfilter?: string
) => {
  //get object property
  if (filter.includes(".")) {
    const getObj = filter.split(".")

    const property =
      Object.getOwnPropertyDescriptor(type, getObj[0] ?? "")?.value ?? "--"
    const value =
      Object.getOwnPropertyDescriptor(property, getObj[1] ?? "")?.value ?? "--"

    return Object.getOwnPropertyDescriptor(value, "name")?.value ?? "--"
  }

  const property = Object.getOwnPropertyDescriptor(type, filter)?.value ?? "--"

  //returns the actual property as string
  if (typeof property === "string" || typeof property === "number") {
    const value = property.toString()
    return value.length > 0 ? property.toString() : "--"

  }

  //dig deeper if obj is an actual obj
  return property
    ? Object.getOwnPropertyDescriptor(property, "name")?.value
    : "--"
}
export const getPropertyIssuance = (
  filter: string,
  type: IssuanceType | UserType | EmployeeType
  //subfilter?: string
) => {
  //get object property

  if (filter.includes(".")) {
    const getObj = filter.split(".")

    const property =
      Object.getOwnPropertyDescriptor(type, getObj[0] ?? "")?.value ?? "--"

    const value =
      Object.getOwnPropertyDescriptor(property, getObj[1] ?? "")?.value ?? "--"

    return value ?? "--"
  }
  const property = Object.getOwnPropertyDescriptor(type, filter)?.value ?? "--"

  //returns the actual property as string
  if (typeof property === "string" || typeof property === "number") {
    const value = property.toString()
    return value.length > 0 ? property.toString() : "--"
  }

  //dig deeper if obj is an actual obj
  return property.toString() ?? "--"
}

export const getPropertyDisposal = (
  filter: string,
  type: DisposeType | AssetRepairType | VendorType | AssetTransferType
  //subfilter?: string
) => {
  //get object property

  if (filter.includes(".")) {
    const getObj = filter.split(".")

    const property =
      Object.getOwnPropertyDescriptor(type, getObj[0] ?? "")?.value ?? "--"

    const value =
      Object.getOwnPropertyDescriptor(property, getObj[1] ?? "")?.value ?? "--"

    return value ?? "--"
  }

  const property = Object.getOwnPropertyDescriptor(type, filter)?.value ?? "--"

  //returns the actual property as string
  if (typeof property === "string" || typeof property === "number") {
    const value = property.toString()
    return value.length > 0 ? property.toString() : "--"
  }

  //dig deeper if obj is an actual obj
  return property.toString() ?? "--"
}

export const getName = (filter: string, type: EmployeeType) => {
  return filter === "first_name"
    ? Object.getOwnPropertyDescriptor(type?.profile || {}, "first_name")?.value
    : filter === "middle_name"
      ? Object.getOwnPropertyDescriptor(type?.profile || {}, "middle_name")?.value
      : Object.getOwnPropertyDescriptor(type?.profile || {}, "last_name")?.value
}

export const getNameUser = (filter: string, type: UserType) => {
  return filter === "first_name"
    ? Object?.getOwnPropertyDescriptor(type?.profile || {}, "first_name")?.value
    : filter === "middle_name"
      ? Object?.getOwnPropertyDescriptor(type?.profile || {}, "middle_name")
        ?.value
      : Object?.getOwnPropertyDescriptor(type?.profile || {}, "last_name")?.value
}

export const getAddressUser = (
  type:
    | UserType
    | (Company & {
      address: Address | null
    })
) => {
  return type?.address?.country !== null ??
    type?.address?.country !== ""
    ? type?.address?.country === "Philippines"
      ? (type?.address?.street ? (type?.address?.street + ", ") : "") +
      (type?.address?.baranggay ? (type?.address?.baranggay + ", ") : "") +
      (type?.address?.city ? (type?.address?.city + ", ") : "") +
      (type?.address?.province ? (type?.address?.province + ", ") : "") +
      (type?.address?.region ? (type?.address?.region + ", ") : "") +
      (type?.address?.country ? (type?.address?.country + ", ") : "") +
      (type?.address?.zip ?? "")
      :
      (type?.address?.street ? (type?.address?.street + ", ") : "") +
      (type?.address?.city ? (type?.address?.city + ", ") : "") +
      (type?.address?.province ? (type?.address?.province + ", ") : "") +
      (type?.address?.country ? (type?.address?.country + ", ") : "") +
      (String(type?.address?.zip) ?? "")
    : "--"
}

export const getBuilding = (type: BuildingType) => {
  return `${type?.name}`
}

export const getAddress = (
  type:
    | EmployeeType
    | (Company & {
      address: Address | null
    })
) => {
  return type?.address?.country !== null ??
    type?.address?.country !== ""
    ? type?.address?.country === "Philippines"
      ? (type?.address?.street ? (type?.address?.street + ", ") : "") +
      (type?.address?.baranggay ? (type?.address?.baranggay + ", ") : "") +
      (type?.address?.city ? (type?.address?.city + ", ") : "") +
      (type?.address?.province ? (type?.address?.province + ", ") : "") +
      (type?.address?.region ? (type?.address?.region + ", ") : "") +
      (type?.address?.country ? (type?.address?.country + ", ") : "") +
      (type?.address?.zip ?? "")
      :
      (type?.address?.street ? (type?.address?.street + ", ") : "") +
      (type?.address?.city ? (type?.address?.city + ", ") : "") +
      (type?.address?.province ? (type?.address?.province + ", ") : "") +
      (type?.address?.country ? (type?.address?.country + ", ") : "") +
      (String(type?.address?.zip) ?? "")
    : "--"
}

export const getWorkMode = (type: EmployeeType) => {
  return `${type?.workMode !== null ? type?.workMode : "--"}`
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
  // if (!data) {  // csv null fall back
  // const worksheet = XLSX.utils.json_to_sheet(data || [])
  const worksheet = XLSX.utils.json_to_sheet(
    data !== null && data !== undefined ? data : []
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "Employee_Sheet.xlsx")
  // }

  return
}

export const downloadExcel_template = (data: ExcelExportType[]) => {
  // if (!data) {  // csv null fall back
  // const worksheet = XLSX.utils.json_to_sheet(data || [])
  const worksheet = XLSX.utils.json_to_sheet(
    data !== null && data !== undefined ? data : []
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "Employee_Template.xlsx")
  // }

  return
}

export const downloadExcelVendor = (data: ExcelExportTypeVendor[]) => {
  console.log(data)

  // if (!data) {
  // csv null fall back
  // const worksheet = XLSX.utils.json_to_sheet(data || [])
  const worksheet = XLSX.utils.json_to_sheet(
    data !== null && data !== undefined ? data : []
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "Vendor_Sheet.xlsx")
  return
}
export const downloadExcelTemplateVendor = (data: ExcelExportTypeVendor[]) => {
  console.log(data)

  // if (!data) {
  // csv null fall back
  // const worksheet = XLSX.utils.json_to_sheet(data || [])
  const worksheet = XLSX.utils.json_to_sheet(
    data !== null && data !== undefined ? data : []
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "Vendor_Template.xlsx")
  return
}

export const downloadExcel_templateAssets = (data: ExcelExportAssetType[]) => {
  console.log("assetsss moooooo::::", data)

  const worksheet = XLSX.utils.json_to_sheet(
    data !== null && data !== undefined ? data : []
  )
  // const worksheet = XLSX.utils.aoa_to_sheet(
  //   [['id', 'name', 'number', 'alt_number', 'serial_no', 'barcode', 'description',
  //     'remarks', 'parentId', 'modelId', 'custodianId', 'vendorId', 'assetProjectId',
  //     'departmentId', 'subsidiaryId', 'addedById', 'status', 'userArchiveId', 'category',
  //     'invoiceNum', 'purchaseOrder', 'deployment_status', 'department', 'parent',
  //     'custodian', 'vendor', 'addedBy', 'management_id', 'currency', 'original_cost',
  //     'current_cost', 'residual_value', 'purchase_date', 'depreciation_start', 'depreciation_end',
  //     'depreciation_status', 'depreciation_period', 'depreciation_rule', 'createdAt',
  //     'updatedAt', 'deletedAt', 'deleted', 'assetId', 'accounting_method', 'depreciation_lifetime',
  //     'residual_percentage', 'asset_location', 'asset_quantity', 'asset_lifetime',
  //     'management_createdAt', 'management_updatedAt', 'mangement_deletedAt',
  //     'management_deleted', 'management_remarks', 'model_id', 'model_name', 'model_number',
  //     'model_createdAt', 'model_updatedAt', 'model_deletedAt', 'model_deleted', 'brand',
  //     'classId', 'typeId', 'categoryId', 'class', 'type']]
  // )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "Asset_Template.xlsx")
  // }

  return
}

export const downloadExcel_assets = (data: ExcelExportAssetType[]) => {
  console.log("assetsss moooooo::::", data)

  // if (!data) {  // csv null fall back
  // const worksheet = XLSX.utils.json_to_sheet(data || [])
  const worksheet = XLSX.utils.json_to_sheet(
    data !== null && data !== undefined ? data : []
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "Asset_Sheet.xlsx")
  // }

  return
}

export const straightLine = (
  cost: number,
  salvage: number,
  lifetime: number,
  period: number
) => {
  const depreciation_value = (cost - salvage) / lifetime

  return depreciation_value * period
}

export const currentValue = (
  cost: number,
  depreciation_value: number,
  start_date: Date
) => {
  const differenceInTime = new Date().getTime() - start_date.getTime()

  const differenceInDay = differenceInTime / (1000 * 3600 * 24)

  const year = convertDaysToYears(differenceInDay)

  const current_value = cost - depreciation_value * year

  return current_value
}

export const getLifetime = (start_date: Date, end_date: Date) => {
  const differenceInTime = end_date.getTime() - start_date.getTime()

  const differenceInDay = differenceInTime / (1000 * 3600 * 24)

  return differenceInDay > 364
    ? `${convertDaysToYears(differenceInDay)} year/s`
    : differenceInDay > 30
      ? `${convertDaysToMonths(differenceInDay)} month/s`
      : `${differenceInDay} day/s`
}

export const convertDaysToYears = (days: number) => {
  return Math.floor(days / 365)
}

export const convertMonthsToYears = (months: number) => {
  return Math.floor(months / 12)
}

export const convertDaysToMonths = (days: number) => {
  return Math.floor(days / 30)
}

export const clearAndGoBack = () => {
  document.forms[0]?.reset()
  router.back()
}

// export const passArrayCheck = async (array: Array<string>, password: string) => {
//   for (const arrays of array){
//     const match = await bcrypt.compare(password, arrays);
//     if(match){
//       return true
//     }
//   }
//   return false
// }

export const generateRandomPass = () => {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:'\",.<>/?\\|"
  const charactersLength = characters.length
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const generateCertificate = () => {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:'\",.<>/?\\|"
  const charactersLength = characters.length
  for (let i = 0; i < 30; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const passConfirmCheck = (password: string, confirmPassword: string) => {
  return password === confirmPassword ? true : false
}
