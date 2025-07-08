import { t } from "../trpc"
import { assetRouter } from "./asset"

import { assetTypeRouter } from "./asset_type"
import { assetActionTypeRouter } from "./asset_actiontype"
import { buildingRouter } from "./building"
import { companyRouter } from "./company"
import { departmentRouter } from "./deparment"
import { disposalTypeRouter } from "./disposal_type"
import { employeeRouter } from "./employee"
import { userRouter } from "./user"

export const appRouter = t.router({
  user: userRouter,
  asset: assetRouter,
  company: companyRouter,
  department: departmentRouter,
  building: buildingRouter,
  employee: employeeRouter,
  assetType: assetTypeRouter,
  assetActionType: assetActionTypeRouter,
  disposalType: disposalTypeRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
