import { Overwrite } from "@trpc/server";
import {
  PASSIVE_COINS_AMOUNT,
  PASSIVE_COINS_DURATION,
  TASK_STRIKE_DURATION_RATIO,
} from "../data/constants";
import { Task, tasks } from "../data/tasks";
import Team, { ITeam } from "../models/team";
import { omit, pick } from "./object";

export type PopulatedTeam = Overwrite<
  ITeam,
  {
    tasks: Overwrite<
      ITeam["tasks"][number],
      {
        task: Task;
      }
    >[];
    currentTask: Pick<Task, "id" | "title"> | null;
  }
>;

export async function createPopulatedTeam(name: string, password: string) {
  const body: Omit<ITeam, "_id"> = {
    name: name,
    password: password,
    registeredAt: new Date(),
    relativeCoins: 100,
    relativeStrikes: 0,
    tasks: [
      {
        task: 0,
        startedAt: new Date(),
        solvedAt: new Date(),
        submits: 1,
        gambleAmount: 0,
        hinted: false,
        unlimitedSubmits: false,
      },
    ],
    currentTask: tasks[1].id,
    chips: [],
  };
  const baseTeam = (await Team.create(body)).toObject();
  const populatedTeam: PopulatedTeam = {
    ...baseTeam,
    tasks: baseTeam.tasks.map((task) => ({
      ...task,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      task: tasks.find((t) => t.id === task.task)!,
    })),
    currentTask:
      typeof baseTeam.currentTask === "number"
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pick(tasks.find((t) => t.id === baseTeam.currentTask)!, {
            id: 1,
            title: 1,
          })
        : null,
  };
  return omit(populatedTeam, { password: 1 });
}

export async function getPopulatedTeam(
  query: Parameters<typeof Team.findOne>[0]
) {
  const team = await Team.findOne(query).select({ password: 0 }).lean();
  if (!team) {
    return null;
  }
  if (!team.tasks) {
    team.tasks = [];
  }
  const populatedTeam: Omit<PopulatedTeam, "password"> = {
    ...team,
    tasks: team.tasks.map((task) => ({
      ...task,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      task: tasks.find((t) => t.id === task.task)!,
    })),
    currentTask:
      typeof team.currentTask === "number"
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pick(tasks.find((t) => t.id === team.currentTask)!, {
            id: 1,
            title: 1,
          })
        : null,
  };
  return populatedTeam;
}

export async function updatePopulatedTeam(
  query: Parameters<typeof Team.findOneAndUpdate>[0],
  update: Parameters<typeof Team.findOneAndUpdate>[1]
) {
  const team = await Team.findOneAndUpdate(query, update, { new: true })
    .select({ password: 0 })
    .lean();
  if (!team) {
    throw new Error("Team not found");
  }
  const populatedTeam: Omit<PopulatedTeam, "password"> = {
    ...team,
    tasks: team.tasks.map((task) => ({
      ...task,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      task: tasks.find((t) => t.id === task.task)!,
    })),
    currentTask:
      typeof team.currentTask === "number"
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pick(tasks.find((t) => t.id === team.currentTask)!, {
            id: 1,
            title: 1,
          })
        : null,
  };
  return populatedTeam;
}

export function getStrikes(team: Omit<PopulatedTeam, "password">) {
  let strikes = team.relativeStrikes;
  for (const task of team.tasks) {
    if (
      (task.frozenAt ?? task.solvedAt ?? new Date()).getTime() -
        task.startedAt.getTime() >
      task.task.duration * TASK_STRIKE_DURATION_RATIO
    ) {
      strikes += 1;
    }
  }
  return strikes;
}

export function getCoins(team: Omit<PopulatedTeam, "password">) {
  let coins = team.relativeCoins;

  // passive coins
  coins +=
    PASSIVE_COINS_AMOUNT *
    Math.floor(
      (Date.now() - team.registeredAt.getTime()) / PASSIVE_COINS_DURATION
    );

  return coins;
}

export function isEliminated(team: Omit<PopulatedTeam, "password">) {
  return getStrikes(team) > 3;
}
