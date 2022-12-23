import {
  AssetType,
  DisposeType,
  EmployeeType,
  VendorType,
} from "../types/generic"
import * as XLSX from "xlsx"
import { ExcelExportType } from "../types/employee"

import { Address, Company } from "@prisma/client"

export const getProperty = (
  filter: string,
  type: AssetType | EmployeeType | VendorType | DisposeType
  //subfilter?: string
) => {
  //get object property
  const property = Object.getOwnPropertyDescriptor(type, filter)?.value ?? "--"

  //returns the actual property as string
  if (typeof property === "string" || typeof property === "number") {
    const value = property.toString()
    return value.length > 0 ? property.toString() : "--"
  }

  //dig deeper if obj is an actual obj
  return property
    ? Object.getOwnPropertyDescriptor(property, "name")?.value ?? "--"
    : "--"
}

export const getPropertyDisposal = (
  filter: string,
  type: DisposeType
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
    ? Object.getOwnPropertyDescriptor(type?.profile, "first_name")?.value
    : filter === "middle_name"
    ? Object.getOwnPropertyDescriptor(type?.profile, "middle_name")?.value
    : Object.getOwnPropertyDescriptor(type?.profile, "last_name")?.value
}

export const getAddress = (
  type:
    | EmployeeType
    | (Company & {
        address: Address | null
      })
) => {
  return `${type?.address?.street}, ${type?.address?.state}, ${type?.address?.city}, ${type?.address?.country} `
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
  // if (!data) {
  // csv null fall back
  const worksheet = XLSX.utils.json_to_sheet(data ?? [])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "DataSheet.xlsx")
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
