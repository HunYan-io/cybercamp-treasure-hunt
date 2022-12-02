import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import superjson from "superjson";

export type Context = {
  req:
    | trpcExpress.CreateExpressContextOptions["req"]
    | CreateWSSContextFnOptions["req"];
  res?: trpcExpress.CreateExpressContextOptions["res"];
};

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
