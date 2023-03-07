import { Address, Profile } from "@prisma/client"
import { EmployeeType, UserType } from "./generic"

export type ExcelExportType = Partial<EmployeeType> &
  Partial<Address> &
  Partial<Profile>

  export type ExcelExportTypeUser = Partial<UserType> &
  Partial<Address> &
  Partial<Profile>