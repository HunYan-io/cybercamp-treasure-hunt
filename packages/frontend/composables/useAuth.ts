import {
  PASSIVE_COINS_DURATION,
  TASK_STRIKE_DURATION_RATIO,
} from "~~/data/constants";
import { AppTRPC } from "./useTRPC";

type AuthResponse = Awaited<ReturnType<AppTRPC["auth"]["data"]["query"]>>;
export type User = AuthResponse["user"];
export type Team = NonNullable<AuthResponse["team"]>;

const user = ref<User | null>(null);
const team = ref<Team | null>(null);

const coinsUpdater = ref(0);
const taskDurationUpdater = ref(0);

const coins = computed(() => {
  coinsUpdater.value;
  return team.value && getCoins(team.value);
});
const strikes = computed(() => {
  taskDurationUpdater.value;
  return team.value && getStrikes(team.value);
});
const eliminated = computed(() => strikes.value && strikes.value > 3);

setInterval(() => coinsUpdater.value++, PASSIVE_COINS_DURATION);

let taskDurationTimeout: NodeJS.Timer | null;
let taskStrikeDurationTimeout: NodeJS.Timer | null;
watchEffect(() => {
  if (taskDurationTimeout) {
    clearTimeout(taskDurationTimeout);
    taskDurationTimeout = null;
  }
  if (taskStrikeDurationTimeout) {
    clearTimeout(taskStrikeDurationTimeout);
    taskStrikeDurationTimeout = null;
  }
  const task = team.value?.tasks.find(
    (t) => t.task.id === team.value?.currentTask?.id
  );
  if (!task) return;
  const duration =
    task.task.duration - (new Date().getTime() - task.startedAt.getTime());
  const strikeDuration =
    task.task.duration * TASK_STRIKE_DURATION_RATIO -
    (new Date().getTime() - task.startedAt.getTime());
  taskDurationTimeout = setTimeout(() => taskDurationUpdater.value++, duration);
  taskStrikeDurationTimeout = setTimeout(
    () => taskDurationUpdater.value++,
    strikeDuration
  );
});

const isLoading = ref(true);

export default function useAuth() {
  return {
    user,
    team,
    isLoading,
    coins,
    strikes,
    eliminated,
    taskDurationUpdater,
    coinsUpdater,
  };
}

export function setAuth({
  user: u,
  team: t,
}: {
  user: User | null;
  team: Team | null;
}) {
  user.value = u;
  team.value = t;
  isLoading.value = false;
}

export function setTeam(t: Team) {
  team.value = t;
}

export function useNonAuthGuard() {
  const { router, routes } = useTypedRouter();
  if (!isLoading.value && user.value) {
    if (!team.value) {
      router.push({ name: routes.team });
    } else {
      router.push({ name: routes.overview });
    }
  }
}

const trpc = useTRPC();
let subscription: ReturnType<typeof trpc.team.onUpdate.subscribe> | null = null;
watch(team, (val) => {
  if (val && !subscription) {
    subscription = trpc.team.onUpdate.subscribe(undefined, {
      onData(data) {
        if (team.value) {
          team.value = data;
        }
      },
      onError(err) {
        console.error("error", err);
      },
    });
  } else if (!val && subscription) {
    subscription.unsubscribe();
    subscription = null;
  }
});
