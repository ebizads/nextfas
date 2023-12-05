import { t } from "../trpc"
import { assetRouter } from "./asset"
import { assetCategoryRouter } from "./asset_category"
import { assetClassRouter } from "./asset_class"
import { assetDisposalRouter } from "./asset_disposal"
import { assetIssuanceRouter } from "./asset_issuance"
import { assetProjectRouter } from "./asset_project"
import { assetRepairRouter } from "./asset_repair"
import { assetTagRouter } from "./asset_tag"
import { assetTransferRouter } from "./asset_transfer"
import { assetTypeRouter } from "./asset_type"
import { buildingRouter } from "./building"
import { companyRouter } from "./company"
import { departmentRouter } from "./deparment"
import { disposalTypeRouter } from "./disposal_type"
import { employeeRouter } from "./employee"
import { teamRouter } from "./team"
import { ticketRouter } from "./ticket"
import { userRouter } from "./user"
import { vendorRouter } from "./vendor"

export const appRouter = t.router({
  user: userRouter,
  asset: assetRouter,
  assetproject: assetProjectRouter,
  company: companyRouter,
  department: departmentRouter,
  team: teamRouter,
  building: buildingRouter,
  vendor: vendorRouter,
  employee: employeeRouter,
  assetProject: assetProjectRouter,
  assetClass: assetClassRouter,
  assetTag: assetTagRouter,
  assetCategory: assetCategoryRouter,
  assetType: assetTypeRouter,
  assetDisposal: assetDisposalRouter,
  assetIssuance: assetIssuanceRouter,
  assetTransfer: assetTransferRouter,
  disposalType: disposalTypeRouter,
  assetRepair: assetRepairRouter,
  ticketTable: ticketRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
