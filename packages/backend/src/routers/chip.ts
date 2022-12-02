import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { chips } from "../data/chips";
import { hasNonEliminatedTeam } from "../middlewares/team";
import { t } from "../trpc";
import { getCoins, updatePopulatedTeam } from "../utils/team";
import { teamEvents } from "./team";

export const chipRouter = t.router({
  buy: t.procedure
    .use(hasNonEliminatedTeam)
    .input(
      z.object({
        id: z.number().int(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const chip = chips.find((chip) => chip.id === input.id);
      if (!chip) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (getCoins(ctx.team) < chip.coins) {
        return { error: "You don't have enough coins" };
      }
      const task = ctx.team.tasks.find(
        (task) => task.task.id === ctx.team.currentTask?.id
      );
      const result = chip.effect(ctx.team, task);
      if ("error" in result) {
        return result;
      }
      result.team.relativeCoins =
        (result.team.relativeCoins ?? ctx.team.relativeCoins) - chip.coins;
      result.team.chips = [
        ...(result.team.chips ?? ctx.team.chips),
        {
          id: chip.id,
          boughtAt: new Date(),
          currentTask: ctx.team.currentTask?.id,
          metadata: result.metadata,
        },
      ];
      const newTeam = await updatePopulatedTeam(
        {
          _id: ctx.team._id,
          ...(task && { "tasks.task": task.task.id }),
        },
        {
          $set: {
            ...result.team,
            ...(task &&
              Object.fromEntries(
                Object.entries(result.task).map(([key, value]) => [
                  `tasks.$.${key}`,
                  value,
                ])
              )),
          },
        }
      );

      teamEvents.emit("update", newTeam);

      return {
        team: newTeam,
        metadata: result.metadata,
      };
    }),
});
