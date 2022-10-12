// src/server/trpc/router/index.ts
import { t } from "../trpc"
import { assetRouter } from "./asset"
import { authRouter } from "./auth"
import { categoryRouter } from "./category"
import { employeeRouter } from "./employee"
import { typeRouter } from "./type"
import { userRouter } from "./user"
import { vendorRouter } from "./vendor"

export const appRouter = t.router({
  auth: authRouter,
  asset: assetRouter,
  categories: categoryRouter,
  type: typeRouter,
  user: userRouter,
  employee: employeeRouter,
  vendor: vendorRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
