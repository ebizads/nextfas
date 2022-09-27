// src/server/trpc/router/index.ts
import { authedProcedure, t } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = t.router({
  auth: authRouter,
  protected: authedProcedure.query(() => "Hello World!"),
});

// export type definition of API
export type AppRouter = typeof appRouter;
