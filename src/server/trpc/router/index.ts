// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { assetRouter } from "./asset";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { manufacturerRouter } from "./manufacturer";
import { supplierRouter } from "./supplier";
import { typeRouter } from "./type";
import { userRouter } from "./user";

export const appRouter = t.router({
  auth: authRouter,
  asset: assetRouter,
  categories: categoryRouter,
  type: typeRouter,
  manufacturer: manufacturerRouter,
  supplier: supplierRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
