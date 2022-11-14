// src/server/trpc/router/index.ts
import { t } from "../trpc"
import { assetRouter } from "./asset"
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
})

// export type definition of API
export type AppRouter = typeof appRouter
