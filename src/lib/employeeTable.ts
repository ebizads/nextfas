//constants

import { ColumnType, DetailType } from "../types/table"

export const columns = [
  { value: "employee_id", name: "Employee ID" },
  { value: "first_name", name: "First Name" },
  { value: "middle_name", name: "Middle Name" },
  { value: "last_name", name: "Last Name" },
  { value: "city", name: "Street Address" },
  { value: "hired_date", name: "Hire Date" },
  { value: "subsidiary", name: "Subsidiary" },
  { value: "email", name: "Email" },
] as ColumnType[]

// export const asset_info = [
//   { type: "name", label: "Name" },
//   { type: "description", label: "Description" },
//   { type: "type", label: "Type" },
//   { type: "manufacturer-name", label: "Manufacturer" },
//   { type: "serial_number", label: "Serial Number" },
//   { type: "vendor-name", label: "Vendor" },
//   { type: "original_cost", label: "Original Cost" },
//   { type: "category-name", label: "Category" },
// ] as DetailType[]

// export const asset_information = [asset_info] as DetailType[][]
