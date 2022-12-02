import { chips } from "~~/data/chips";

export default function useEnabledChips() {
  const { strikes, eliminated, coins, taskDurationUpdater, team } = useAuth();
  const isEnabled = reactive({} as Record<number, boolean>);
  for (const chip of chips) {
    watchEffect(() => {
      isEnabled[chip.id] = (() => {
        if (eliminated.value) return false;
        if (chip.coins > (coins.value ?? 0)) return false;
        const task = team.value?.tasks.find(
          (t) => t.task.id === team.value?.currentTask?.id
        );
        switch (chip.id) {
          case 0:
            return !!strikes.value && !eliminated.value;
          case 1:
            if (!task) {
              return false;
            }
            if (task.solvedAt) {
              return false;
            }
            if (task.frozenAt) {
              return false;
            }
            taskDurationUpdater.value;
            if (
              task.gambleAmount &&
              Date.now() - task.startedAt.getTime() < task.task.duration
            ) {
              return false;
            }

            return true;
          case 2:
            if (!task) {
              return false;
            }
            if (task.solvedAt) {
              return false;
            }
            if (task.hinted) {
              return false;
            }

            return true;
          case 3:
            if (!task) {
              return false;
            }
            if (task.solvedAt) {
              return false;
            }
            if (task.unlimitedSubmits) {
              return false;
            }

            return true;
          default:
            return true;
        }
      })();
    });
  }
  return isEnabled;
}
