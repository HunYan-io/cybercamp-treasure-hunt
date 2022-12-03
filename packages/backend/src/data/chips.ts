import { ITeam } from "../models/team";
import { getStrikes, PopulatedTeam } from "../utils/team";
import { hints } from "./hints";

export interface Chip {
  id: number;
  coins: number;
  effect: (
    team: Omit<PopulatedTeam, "password">,
    task?: PopulatedTeam["tasks"][number]
  ) =>
    | {
        team: Partial<Omit<ITeam, "password">>;
        task: Partial<ITeam["tasks"][number]>;
        metadata: Record<string, unknown>;
      }
    | { error: string };
}

export const chips: Chip[] = [
  {
    id: 0,
    coins: 500,
    effect: (team) => {
      if (getStrikes(team) === 0) {
        return { error: "You don't have any strikes." };
      }
      return {
        team: {
          relativeStrikes: team.relativeStrikes - 1,
        },
        task: {},
        metadata: {},
      };
    },
  },
  {
    id: 1,
    coins: 500,
    effect: (team, task) => {
      if (!task) {
        return { error: "You haven't started your task." };
      }
      if (task.solvedAt) {
        return { error: "You can't freeze time after solving the task." };
      }
      if (task.frozenAt) {
        return { error: "You can't freeze time twice." };
      }
      if (
        task.gambleAmount &&
        Date.now() - task.startedAt.getTime() < task.task.duration &&
        task.task.id !== 5
      ) {
        return {
          error:
            "You can't freeze time while gambling unless the countdown for task reward is over.",
        };
      }

      return {
        team: {},
        task: {
          frozenAt: new Date(),
        },
        metadata: task.task.id === 5 ? { hint: "171" } : {},
      };
    },
  },
  {
    id: 2,
    coins: 500,
    effect: (team, task) => {
      if (!task) {
        return { error: "You haven't started your task." };
      }
      if (task.solvedAt) {
        return { error: "You can't get a hint after solving the task." };
      }
      if (task.hinted) {
        return { error: "You can't get a hint twice." };
      }
      const hint = hints.find((hint) => hint.task === task.task.id);
      if (!hint) {
        return { error: "There is no hint for this task." };
      }

      return {
        team: {},
        task: {
          hinted: true,
        },
        metadata: {
          hint: hint.hint,
        },
      };
    },
  },
  {
    id: 3,
    coins: 500,
    effect: (team, task) => {
      if (!task) {
        return { error: "You haven't started your task." };
      }
      if (task.solvedAt) {
        return {
          error: "You can't get unlimited submits after solving the task.",
        };
      }
      if (task.unlimitedSubmits) {
        return { error: "You can't get unlimited submits twice." };
      }

      return {
        team: {},
        task: {
          unlimitedSubmits: true,
        },
        metadata: {},
      };
    },
  },
];
