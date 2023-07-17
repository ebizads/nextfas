//constants

import { ColumnType } from "../types/table"

export const columns = [
  { value: "employee_id", name: "Employee ID" },
  { value: "first_name", name: "First Name" },
  { value: "last_name", name: "Last Name" },
  { value: "city", name: "Street Address" },
  { value: "team", name: "Team" },
  { value: "email", name: "Email" },
  { value: "workMode", name: "Work Mode" },
] as ColumnType[]

export const columnsuser = [
  { value: "user_Id", name: "User ID" },
  { value: "first_name", name: "First Name" },
  { value: "last_name", name: "Last Name" },
  { value: "city", name: "Street Address" },
  { value: "hired_date", name: "Hire Date" },
  { value: "team", name: "Team" },
  { value: "email", name: "Email" },
  // { valie: "workMode", name: "Work Mode"},
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
