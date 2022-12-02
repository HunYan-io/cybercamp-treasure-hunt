import { t } from "../trpc";
import { authRouter } from "./auth";
import { chipRouter } from "./chip";
import { taskRouter } from "./task";
import { teamRouter } from "./team";

export const appRouter = t.router({
  auth: authRouter,
  team: teamRouter,
  task: taskRouter,
  chip: chipRouter,
});

export type AppRouter = typeof appRouter;
