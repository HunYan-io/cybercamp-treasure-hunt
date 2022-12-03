<script lang="ts" setup>
import { Team } from "~~/composables/useAuth";
import { TASK_SUBMIT_FEES } from "~~/data/constants";

const props = defineProps<{
  modelValue: boolean;
  task?: Team["tasks"][number];
  partialTask?: Team["currentTask"];
}>();
const emit = defineEmits(["update:modelValue", "start"]);

const task = toRef(props, "task");
const partialTask = toRef(props, "partialTask");
const flag = ref("");

const flagError = ref("");
const gambleError = ref("");

const amount = ref<string>("");

const isOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

watch(isOpen, (value) => {
  if (value) {
    flag.value = "";
    flagError.value = "";
    gambleError.value = "";
    amount.value = "";
  }
});

watch(flag, () => {
  if (flagError.value) {
    flagError.value = "";
  }
});

const { coins, team, eliminated } = useAuth();

function gamble() {
  const gambleAmount = Number(amount.value);
  if (gambleAmount <= 0) {
    gambleError.value = "Amount must be greater than 0";
    return;
  } else if (!coins.value || coins.value < gambleAmount) {
    gambleError.value = "You don't have enough coins";
    return;
  }
  start(gambleAmount);
}

function startWithoutGambling() {
  start(0);
}

const trpc = useTRPC();

function start(gambleAmount: number) {
  trpc.task.start
    .mutate({
      gambleAmount,
    })
    .then((newTeam) => {
      if (!team.value) return;
      team.value = newTeam;
      emit("start");
    })
    .catch(() => {
      gambleError.value = "Unexpected error";
    });
}

function cancel() {
  isOpen.value = false;
}

const isSubmitting = ref(false);
function submit() {
  if (!task.value) return;
  if (!flag.value) {
    flagError.value = "Enter a flag";
    return;
  }
  isSubmitting.value = true;
  trpc.task.submit
    .mutate({
      flag: flag.value,
      taskId: task.value.task.id,
    })
    .then((result) => {
      isSubmitting.value = false;
      if (!team.value) return;
      if ("error" in result && result.error) {
        flagError.value = result.error;
        return;
      }
      if ("isCorrect" in result && !result.isCorrect) {
        flagError.value = "Wrong answer";
      }
      if ("currentTask" in result) {
        const task = team.value.tasks.find(
          (task) => task.task.id === team.value?.currentTask?.id
        );
        team.value.currentTask = result.currentTask;
        team.value.relativeCoins = result.relativeCoins;
        team.value.relativeStrikes = result.relativeStrikes;
        if (task) {
          task.solvedAt = result.solvedAt;
          task.submits = result.submits;
        }
      }
    })
    .catch(() => {
      isSubmitting.value = false;
      flagError.value = "Unexpected error";
    });
}
</script>

<template>
  <Modal v-model="isOpen">
    <div class="flex flex-col items-stretch gap-10 text-center">
      <template v-if="task">
        <h3 class="font-display text-2xl font-bold text-white">
          {{ task.task.title }}
        </h3>
        <div class="flex flex-col items-end gap-4">
          <div>
            Reward:
            {{ task.task.coins }} Coins
          </div>
          <div>Wrong submits: {{ task.submits - (task.solvedAt ? 1 : 0) }}</div>
          <div v-if="task.gambleAmount">
            Gambling:
            {{ task.gambleAmount }} Coins
          </div>
        </div>
        <div class="absolute right-8 top-8">
          <button class="relative h-11 w-11" @click="cancel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="36"
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-white"
            >
              <path
                d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
              />
            </svg>
          </button>
        </div>
        <div class="py-5 font-body text-base text-white">
          {{ task.task.description }}
        </div>
        <div v-if="task.task.image || task.task.audio">
          <img v-if="task.task.image" :src="task.task.image" class="w-full" />
          <audio
            v-if="task.task.audio"
            controls
            class="w-full"
            :src="task.task.audio"
          />
        </div>
        <template v-if="!task.solvedAt && !eliminated">
          <TextField id="flag" v-model="flag" label="Flag" />
          <div v-if="!!flagError" class="font-body text-base text-error">
            {{ flagError }}
          </div>
          <div class="flex w-full flex-col items-stretch gap-4">
            <PrimaryButton
              class="w-full"
              :disabled="isSubmitting"
              @click="submit"
              >Submit</PrimaryButton
            >
            <div class="ml-auto text-end">
              Submit fees: {{ TASK_SUBMIT_FEES }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="text-shadow-solid2 font-display font-bold text-primary">
            {{ task.solvedAt ? "Solved" : "Eliminated" }}
          </div>
        </template>
      </template>
      <template v-if="partialTask && !task">
        <h3 class="font-display text-2xl font-bold text-white">
          Do you want to gamble on this task?
        </h3>
        <div class="absolute right-8 top-8">
          <button class="relative h-11 w-11" @click="cancel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="36"
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-white"
            >
              <path
                d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
              />
            </svg>
          </button>
        </div>
        <div class="pb-5 font-body text-base text-white">
          By gambling, you immediately lose the gamble amount you put. However,
          you also receive double the amount if you can finish the task before
          the task reward countdown is over.
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex flex-wrap justify-center gap-5">
            <div class="flex flex-1 flex-col items-stretch">
              <TextField
                id="amount"
                v-model="amount"
                type="number"
                label="Gamble Amount"
              />
            </div>
            <div class="flex-shrink">
              <PrimaryButton class="w-full" @click="gamble"
                >Gamble</PrimaryButton
              >
            </div>
          </div>
          <div v-if="!!gambleError" class="font-body text-base text-error">
            {{ gambleError }}
          </div>
        </div>
        <div class="font-display text-base font-bold">OR</div>
        <PrimaryButton @click="startWithoutGambling"
          >Start without gambling</PrimaryButton
        >
      </template>
    </div>
  </Modal>
</template>
