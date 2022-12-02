<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";
import { Team } from "~~/composables/useAuth";
import { chips } from "~~/data/chips";
import { TASK_STRIKE_DURATION_RATIO } from "~~/data/constants";

const isSignoutModalOpen = ref(false);
useNavbar({
  logoAction: { to: { name: "overview" } },
  items: [
    {
      name: "Overview",
      to: { name: "overview" },
      active: true,
    },
    {
      name: "Chips",
      to: { name: "chips" },
    },
    {
      name: "Sign Out",
      onClick: () => {
        isSignoutModalOpen.value = true;
      },
    },
  ],
});
const props = defineProps<{
  team: Team;
}>();

const isTaskModalOpen = ref(false);
const openedTask = ref<Team["tasks"][number] | undefined>(undefined);
const partialTask = ref<Team["currentTask"] | undefined>(undefined);

const { coins, strikes, eliminated } = useAuth();
const team = toRef(props, "team");

const breakpoints = useBreakpoints(breakpointsTailwind);

const isSm = breakpoints.smallerOrEqual("sm");

const itemsWidth = computed(() => (isSm.value ? 800 : 120));

function openTask(task?: Team["tasks"][number]) {
  openedTask.value = task;
  if (!task) {
    partialTask.value = team.value.currentTask;
  }
  isTaskModalOpen.value = true;
}

const currentTaskNotStarted = computed(() => {
  return (
    !!team.value?.currentTask &&
    !team.value.tasks.find(
      (task) => task.task.id === team.value.currentTask?.id
    )
  );
});

const startedTask = computed(() => {
  return team.value.tasks.find(
    (task) => task.task.id === team.value.currentTask?.id
  );
});

const startedTaskStrikeDuration = computed(() => {
  return startedTask?.value
    ? startedTask.value.task.duration * TASK_STRIKE_DURATION_RATIO
    : undefined;
});

function onStart() {
  const task = team.value.tasks.find(
    (task) => task.task.id === team.value.currentTask?.id
  );
  openedTask.value = task;
  if (!task) {
    partialTask.value = team.value.currentTask;
  }
}

function getChipImage(id: number) {
  return chips.find((chip) => chip.id === id)?.image;
}

const { showHint } = useHint();
function onChipClick(chip: Team["chips"][number]) {
  if (chip.metadata && "hint" in chip.metadata) {
    const task = team.value.tasks.find(
      (task) => task.task.id === chip.currentTask
    );
    if (!task) return;
    showHint(task.task.title, chip.metadata.hint);
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col items-center justify-center gap-20 py-32">
    <PrimarySection
      class="text-center font-display text-4xl font-bold text-black"
    >
      {{ team.name }}
    </PrimarySection>
    <div
      v-if="eliminated"
      class="text-center font-display text-4xl font-bold text-white"
    >
      You were eliminated.
    </div>
    <div
      class="container flex flex-col items-stretch justify-between gap-12 sm:flex-row 2xl:max-w-7xl"
    >
      <div class="flex flex-shrink flex-row flex-wrap gap-12 sm:flex-col">
        <div class="flex min-w-0 flex-1 basis-40 flex-col gap-4 sm:basis-0">
          <UnderlinedHeader :width="itemsWidth"> Coins </UnderlinedHeader>
          <div class="font-display text-3xl font-bold text-white">
            {{ coins }}
          </div>
        </div>
        <div class="flex min-w-0 flex-1 basis-40 flex-col gap-4 sm:basis-0">
          <UnderlinedHeader :width="itemsWidth">
            Reward Countdown
          </UnderlinedHeader>
          <div class="font-display text-3xl font-bold text-white">
            <Countdown
              :counting-since="startedTask?.startedAt"
              :duration="startedTask?.task?.duration"
              :frozen-at="startedTask?.frozenAt"
            />
          </div>
        </div>
        <div class="flex min-w-0 flex-1 basis-40 flex-col gap-4 sm:basis-0">
          <UnderlinedHeader :width="itemsWidth">
            Strike Countdown
          </UnderlinedHeader>
          <div class="font-display text-3xl font-bold text-white">
            <Countdown
              :counting-since="startedTask?.startedAt"
              :duration="startedTaskStrikeDuration"
              :frozen-at="startedTask?.frozenAt"
            />
          </div>
        </div>
        <div class="flex min-w-0 flex-1 basis-40 flex-col gap-4 sm:basis-0">
          <UnderlinedHeader :width="itemsWidth"> Strikes </UnderlinedHeader>
          <div class="font-display text-3xl font-bold text-white">
            {{ strikes }}
          </div>
        </div>
      </div>
      <div class="flex min-w-0 max-w-3xl flex-1 flex-col gap-12">
        <div class="flex flex-col gap-7">
          <UnderlinedHeader> Tasks </UnderlinedHeader>
          <div
            v-if="currentTaskNotStarted"
            class="flex cursor-pointer items-center gap-7"
            @click="openTask(undefined)"
          >
            <TaskCheckbox :checked="false" />
            <div class="flex flex-col gap-2">
              <div class="font-body text-lg text-white">
                {{ team.currentTask?.title }}
              </div>
              <TaskButton> Open Task </TaskButton>
            </div>
          </div>
          <div
            v-for="task in [...team.tasks].reverse()"
            :key="task.task.id"
            class="flex cursor-pointer items-center gap-7"
            @click="openTask(task)"
          >
            <TaskCheckbox :checked="!!task.solvedAt" />
            <div class="flex flex-col gap-2">
              <div class="font-body text-lg text-white">
                {{ task.task.title }}
              </div>
              <TaskButton> Open Task </TaskButton>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <UnderlinedHeader> Chips Used </UnderlinedHeader>
          <div class="flex flex-wrap gap-4">
            <img
              v-for="chip in [...team.chips].reverse()"
              :key="chip.boughtAt.toString()"
              :src="getChipImage(chip.id)"
              class="min-h-[100px] min-w-[100px]"
              @click="onChipClick(chip)"
            />
            <ChipPlaceholderButton :to="{ name: 'chips' }" />
          </div>
        </div>
      </div>
    </div>
    <TaskModal
      v-model="isTaskModalOpen"
      :task="openedTask"
      :partial-task="partialTask"
      modal-id="task-modal"
      @start="onStart"
    />
    <SignoutModal v-model="isSignoutModalOpen" modal-id="signout" />
    <HintModal modal-id="hint" />
  </main>
</template>