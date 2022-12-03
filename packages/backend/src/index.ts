import "dotenv/config";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { join } from "path";
import mongoose from "mongoose";
import { Context } from "./trpc";
import { authenticateRequest } from "./middlewares/auth";
import { AppRouter, appRouter } from "./routers/_app";
import cookieParser from "cookie-parser";
import ws from "ws";
import http from "http";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

const app = express();
app.use(cookieParser());

// tRPC server
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: async ({
      req,
      res,
    }: trpcExpress.CreateExpressContextOptions): Promise<Context> => ({
      req,
      res,
    }),
  })
);

// Static files server
if (process.env.NODE_ENV === "production") {
  const authRedirection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = await authenticateRequest(req);
    if (!user) {
      return next();
    }
    if (user.team) {
      return res.redirect("/overview");
    } else {
      return res.redirect("/team");
    }
  };
  const nonAuthRoutes = [
    "/",
    "/index.html",
    "/login",
    "/login/index.html",
    "/register",
    "/register/index.html",
  ];
  for (const route of nonAuthRoutes) {
    app.get(route, authRedirection);
  }
  app.use(
    express.static(join(__dirname, "..", "..", "frontend", ".output", "public"))
  );
  app.get("*", async (req, res) => {
    return res.sendFile(
      join(__dirname, "..", "..", "frontend", ".output", "public", "404.html")
    );
  });
}

const server = http.createServer(app);

const wss = new ws.Server({ server, path: "/wstrpc" });
applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext: async ({ req }) => ({ req }),
});

if (!process.env.DB_URI) {
  throw new Error("DB_URI not set");
}

mongoose.connect(process.env.DB_URI).then(() => {
  console.log("Connected to database");
  server.listen(+(process.env.PORT ?? 8080), () => {
    console.log(`Listening on port ${process.env.PORT ?? 8080}`);
  });
});

export { AppRouter };
