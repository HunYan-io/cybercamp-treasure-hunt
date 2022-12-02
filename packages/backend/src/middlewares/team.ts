import { TRPCError } from "@trpc/server";
import { t } from "../trpc";
import { getPopulatedTeam, isEliminated } from "../utils/team";
import { authenticateRequest } from "./auth";

export const hasTeam = t.middleware(async ({ ctx, next }) => {
  const user = await authenticateRequest(ctx.req);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!user.team) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  const team = await getPopulatedTeam({ _id: user.team });
  if (!team) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({
    ctx: {
      user: user,
      team: team,
    },
  });
});

export const hasNoTeam = t.middleware(async ({ ctx, next }) => {
  const user = await authenticateRequest(ctx.req);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (user.team) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({
    ctx: {
      user: user,
    },
  });
});

export const hasNonEliminatedTeam = t.middleware(async ({ ctx, next }) => {
  const user = await authenticateRequest(ctx.req);
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!user.team) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  const team = await getPopulatedTeam({ _id: user.team });
  if (!team) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  if (isEliminated(team)) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({
    ctx: {
      user: user,
      team: team,
    },
  });
});
