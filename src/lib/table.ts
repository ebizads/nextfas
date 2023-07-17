//constants

import { UserType } from "../types/generic"
import { ColumnType, DetailType, NavType } from "../types/table"

export const columns = [
  { value: "number", name: "Asset No." },
  { value: "serial_no", name: "Serial No." },
  // { value: "type", name: "Type" },
  { value: "name", name: "Asset Name" },
  // { value: "description", name: "Description" },
  { value: "custodian", name: "Custodian" },
  // { value: "createdAt", name: "Added Date" },
  { value: "deployment_status", name: "Status" },
] as ColumnType[]

export const vendorColumns = [
  { value: "id", name: "Vendor ID." },
  { value: "type", name: "Type" },
  { value: "name", name: "Company Name" },
  { value: "category.name", name: "Category" },
  { value: "website", name: "Web Address" },
  { value: "email", name: "Email" },
  { value: "phone_no", name: "Phone Number" },
  { value: "address.city", name: "City" },
] as ColumnType[]

export const userColumns = [
  { value: "user_Id", name: "User ID" },
  { value: "first_name", name: "First Name" },
  { value: "last_name", name: "Last Name" },
  { value: "city", name: "Street Address" },
  { value: "hired_date", name: "Hire Date" },
  { value: "team", name: "Team" },
  { value: "email", name: "Email" },
] as ColumnType[]

export const employeeColumns = [
  { value: "employee_id", name: "Employee ID" },
  { value: "first_name", name: "First Name" },
  { value: "last_name", name: "Last Name" },
  { value: "city", name: "Street Address" },
  { value: "team", name: "Team" },
  { value: "email", name: "Email" },
  { value: "workMode", name: "Work Mode" },
] as ColumnType[]

export const disposalColumn = [
  { value: "asset.number", name: "Asset No." },
  { value: "asset.name", name: "Asset Name" },
  { value: "disposalDate", name: "Disposal Date" },
  { value: "completionDate", name: "Disposal Completion" },
  { value: "disposalType.name", name: "Disposal Method" },
] as ColumnType[]

export const transferColumn = [
  { value: "asset.number", name: "Asset No." },
  { value: "asset.name", name: "Asset Name" },
  { value: "transferDate", name: "Transfer Date" },
  { value: "transferStatus", name: "Status" },
  { value: "transferLocation", name: "Location" },
  { value: "custodian", name: "Recipient" },
] as ColumnType[]

export const repairColumn = [
  { value: "asset.number", name: "Asset Number" },
  { value: "asset.name", name: "Asset Name" },
  { value: "assetPart", name: "Asset Part" },
  { value: "notes", name: "Notes" },
] as ColumnType[]

export const showAssetsBy = [5, 10, 20, 50] as number[]

export const asset_info = [
  { type: "name", label: "Name" },
  { type: "description", label: "Description" },
  { type: "type", label: "Type" },
  { type: "manufacturer-name", label: "Manufacturer" },
  { type: "serial_no", label: "Serial Number" },
  { type: "vendor-name", label: "Vendor" },
  { type: "original_cost", label: "Original Cost" },
  { type: "category-name", label: "Category" },
] as DetailType[]

export const vendor_info = [
  { type: "company-name", label: "Company Name" },
  { type: "type", label: "Type" },
  { type: "url", label: "Website Link" },
  { type: "email", label: "Email Address" },
  { type: "phone_no", label: "Phone Number" },
  { type: "address", label: "Address" },
] as DetailType[]

export const manufacturer_info = [
  { type: "manufacturer-name", label: "Manufacturer Name" },
  { type: "type", label: "Type" },
  { type: "url", label: "Website Link" },
  { type: "image_name", label: "Image" },
  { type: "email", label: "Email Address" },
  { type: "phone_no", label: "Phone Number" },
  { type: "alt_phone_no", label: "Alt Phone Number" },
  { type: "fax_no", label: "Fax Number" },
] as DetailType[]

export const purchase_info = [
  { type: "vendor-name", label: "Vendor Name" },
  { type: "payment_method", label: "Payment Method" },
  { type: "account_ref_no", label: "Account Ref. No." },
  { type: "cost", label: "Purchase Cost" },
  { type: "date", label: "Purchased Date" },
  { type: "delivery_date", label: "Delivered Date" },
  { type: "address", label: "Billing Date" },
  { type: "shipping_method", label: "Shipping Method" },
] as DetailType[]

export const asset_information = [
  asset_info,
  vendor_info,
  manufacturer_info,
  purchase_info,
] as DetailType[][]

export const navigations = [
  {
    name: "Employees",
    icon: "fa-users",
    link: "/employees",
  },
  // {
  //   name: "Asset Issuance",
  //   icon: "fa-users",
  //   link: "/issuance",
  // },
  {
    name: "Vendors",
    icon: "fa-store",
    link: "/vendors",
  },
  // {
  //   name: "User Management",
  //   icon: "fa-user-pen",
  //   link: "/vendors",
  // },
  // {
  //   name: "Inventory",
  //   icon: "fa-light fa-folders",
  //   link: "/inventory",
  // },
] as NavType[]
