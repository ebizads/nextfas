// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { assetRouter } from "./asset";
import { authRouter } from "./auth";

export const appRouter = t.router({
  auth: authRouter,
  asset: assetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
