import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  GAINED_GAMBLE_AMOUNT_RATIO,
  TASK_STRIKE_WRONG_SUBMITS,
  TASK_SUBMIT_FEES,
} from "../data/constants";
import { tasks } from "../data/tasks";
import { hasNonEliminatedTeam } from "../middlewares/team";
import { ITeam } from "../models/team";
import { t } from "../trpc";
import { pick } from "../utils/object";
import { getCoins, updatePopulatedTeam, PopulatedTeam } from "../utils/team";
import { teamEvents } from "./team";

export const taskRouter = t.router({
  submit: t.procedure
    .use(hasNonEliminatedTeam)
    .input(
      z.object({
        taskId: z.number().int(),
        flag: z.string(),
      })
    )
    .mutation(
      async ({
        ctx,
        input,
      }): Promise<
        | { error: string }
        | {
            isCorrect: boolean;
            relativeCoins: number;
            relativeStrikes: number;
            submits: number;
            solvedAt?: Date;
            currentTask: PopulatedTeam["currentTask"];
          }
      > => {
        const task = ctx.team.tasks.find(
          (task) => task.task.id === input.taskId
        );
        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (task.solvedAt) {
          throw new TRPCError({ code: "CONFLICT" });
        }

        if (getCoins(ctx.team) < TASK_SUBMIT_FEES) {
          return { error: "You don't have enough coins" };
        }

        const isCorrect =
          task.task.flag.toLowerCase() === input.flag.toLowerCase();
        const now = new Date();

        let relativeCoins = ctx.team.relativeCoins;
        let relativeStrikes = ctx.team.relativeStrikes;
        let submits = task.submits;

        submits++;

        if (!task.unlimitedSubmits) {
          if (!isCorrect && submits % TASK_STRIKE_WRONG_SUBMITS === 0) {
            relativeStrikes++;
          }
          relativeCoins -= TASK_SUBMIT_FEES;
        }

        if (
          isCorrect &&
          (task.frozenAt ?? now).getTime() - task.startedAt.getTime() <
            task.task.duration
        ) {
          relativeCoins += task.task.coins;
          relativeCoins += task.gambleAmount * GAINED_GAMBLE_AMOUNT_RATIO;
        }

        let newTask: PopulatedTeam["currentTask"] | null = ctx.team.currentTask;
        if (
          ctx.team.currentTask &&
          ctx.team.currentTask.id === task.task.id &&
          isCorrect
        ) {
          const newIndex = tasks.findIndex((t) => t.id === task.task.id) + 1;
          if (newIndex < tasks.length) {
            newTask = pick(tasks[newIndex], { id: 1, title: 1 });
          } else {
            newTask = null;
          }
        }

        const newTeam = await updatePopulatedTeam(
          {
            _id: ctx.team._id,
            "tasks.task": task.task.id,
          },
          {
            $set: {
              relativeCoins,
              relativeStrikes,
              "tasks.$.submits": submits,
              "tasks.$.solvedAt": isCorrect ? now : null,
              currentTask: newTask?.id ?? null,
            },
          }
        );

        teamEvents.emit("update", newTeam);

        return {
          isCorrect,
          relativeCoins,
          relativeStrikes,
          submits,
          solvedAt: isCorrect ? now : undefined,
          currentTask: newTask,
        };
      }
    ),
  start: t.procedure
    .use(hasNonEliminatedTeam)
    .input(
      z.object({
        gambleAmount: z.number().int().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = tasks.find((task) => task.id === ctx.team.currentTask?.id);
      if (!task || !ctx.team.currentTask) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (getCoins(ctx.team) < input.gambleAmount) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const entry: ITeam["tasks"][0] = {
        task: ctx.team.currentTask.id,
        startedAt: new Date(),
        submits: 0,
        unlimitedSubmits: false,
        hinted: false,
        gambleAmount: input.gambleAmount,
      };

      const newTeam = await updatePopulatedTeam(
        { _id: ctx.team._id, "tasks.task": { $ne: task.id } },
        {
          $push: {
            tasks: entry,
          },
          $inc: {
            relativeCoins: -input.gambleAmount,
          },
        }
      );

      teamEvents.emit("update", newTeam);

      return newTeam;
    }),
});
