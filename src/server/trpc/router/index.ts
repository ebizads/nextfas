// src/server/trpc/router/index.ts
import { t } from "../trpc"
import { assetRouter } from "./asset"
import { assetCategoryRouter } from "./asset_category"
import { assetClassRouter } from "./asset_class"
import { assetProjectRouter } from "./asset_project"
import { assetTypeRouter } from "./asset_type"
import { companyRouter } from "./company"
import { departmentRouter } from "./deparment"
import { employeeRouter } from "./employee"
import { teamRouter } from "./team"
import { userRouter } from "./user"
import { vendorRouter } from "./vendor"

export const appRouter = t.router({
  user: userRouter,
  asset: assetRouter,
  company: companyRouter,
  department: departmentRouter,
  team: teamRouter,
  vendor: vendorRouter,
  employee: employeeRouter,
  assetProject: assetProjectRouter,
  assetClass: assetClassRouter,
  assetCategory: assetCategoryRouter,
  assetType: assetTypeRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
