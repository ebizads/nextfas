import { Address_vendor } from "@prisma/client"
import { VendorType } from "./generic"

export type ExcelExportTypeVendor = Partial<VendorType> &
    Partial<Address_vendor> 
