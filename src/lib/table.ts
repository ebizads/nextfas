//constants

import { ColumnType, DetailType, NavType } from "../types/table"

export const columns = [
  { value: "serial_number", name: "Serial No." },
  { value: "bar_code", name: "Bar Code" },
  { value: "type", name: "Type" },
  { value: "category", name: "Category" },
  { value: "name", name: "Name" },
  { value: "description", name: "Description" },
  { value: "owner", name: "Owner" },
  { value: "added_date", name: "Added Date" },
] as ColumnType[]

export const vendorColumns = [
  { value: "id", name: "Vendor ID." },
  { value: "type/name", name: "Type" },
  { value: "name", name: "Company Name" },
  { value: "category/name", name: "Category" },
  { value: "url", name: "Web Address" },
  { value: "email", name: "Email" },
  { value: "phone_no", name: "Phone Number" },
  { value: "alt_phone_no", name: "Alternate Number" },
  { value: "fax_no", name: "Fax Number" },
  { value: "address", name: "Address" },
  { value: "image", name: "Image" },
  { value: "comments", name: "Comments" },
] as ColumnType[]

export const employeeColumns = [
  { value: "employee_id", name: "Employee ID" },
  { value: "first_name", name: "First Name" },
  { value: "middle_name", name: "Middle Name" },
  { value: "last_name", name: "Last Name" },
  { value: "city", name: "Street Address" },
  { value: "hired_date", name: "Hire Date" },
  { value: "subsidiary", name: "Subsidiary" },
  { value: "email", name: "Email" },
] as ColumnType[]

export const showAssetsBy = [5, 10, 20, 50] as number[]

export const asset_info = [
  { type: "name", label: "Name" },
  { type: "description", label: "Description" },
  { type: "type", label: "Type" },
  { type: "manufacturer-name", label: "Manufacturer" },
  { type: "serial_number", label: "Serial Number" },
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
  {
    name: "Vendors",
    icon: "fa-store",
    link: "/vendors",
  },
  {
    name: "Inventory",
    icon: "fa-light fa-folders",
    link: "/inventory",
  },
] as NavType[]
