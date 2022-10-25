export type ColumnType = {
  name: string
  value: string
}

export type SubNavType = {
  name: string
  icon?: string
  link: string
}
export interface NavType {
  name: string
  icon: string
  link: string
  subType?: SubNavType[]
}

export type EmployeeRowType = {
  id: number
  first_name: string
  middle_name: string
  last_name: string
  id_no: string
  address: string
  hire_date: string
  subsidiary: string
  contact_number: string
}

export type ImageJSON = {
  name: string
  size: number
  file: string
}

export type DetailType = {
  type: string
  label: string
}
