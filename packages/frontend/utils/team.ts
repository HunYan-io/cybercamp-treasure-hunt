import { Team } from "~~/composables/useAuth";
import {
  PASSIVE_COINS_AMOUNT,
  PASSIVE_COINS_DURATION,
  TASK_STRIKE_DURATION_RATIO,
} from "~~/data/constants";

export function getStrikes(team: Team) {
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

export function getCoins(team: Team) {
  let coins = team.relativeCoins;

  // passive coins
  coins +=
    PASSIVE_COINS_AMOUNT *
    Math.floor(
      (Date.now() - team.registeredAt.getTime()) / PASSIVE_COINS_DURATION
    );

  return coins;
}
