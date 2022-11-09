import { address, profile } from "@prisma/client"
import { EmployeeType } from "./generic"

export type ExcelExportType = Partial<EmployeeType> &
  Partial<address> &
  Partial<profile>
