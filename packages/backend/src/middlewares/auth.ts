import jwt from "jsonwebtoken";
import * as trpcExpress from "@trpc/server/adapters/express";
import User, { AuthUser, authUserFields } from "../models/user";
import { t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import cookie from "cookie";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not set");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateRequest = async (
  req:
    | trpcExpress.CreateExpressContextOptions["req"]
    | CreateWSSContextFnOptions["req"]
): Promise<AuthUser | null> => {
  const token =
    "cookies" in req
      ? req.cookies?.["token"]
      : cookie.parse(req.headers.cookie || "")?.["token"];
  if (typeof token !== "string") {
    return null;
  }
  return new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return resolve(null);
      }
      if (
        !decoded ||
        typeof decoded !== "object" ||
        typeof decoded._id !== "string"
      ) {
        return resolve(null);
      }
      const user = await User.findById(decoded._id)
        .select(authUserFields)
        .lean();
      return resolve(user as AuthUser);
    });
  });
};

export const isAuth = t.middleware(async ({ ctx, next }) => {
  const user = await authenticateRequest(ctx.req);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user,
    },
  });
});

export const isNotAuth = t.middleware(async ({ ctx, next }) => {
  const user = await authenticateRequest(ctx.req);
  if (user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({
    ctx: {},
  });
});
