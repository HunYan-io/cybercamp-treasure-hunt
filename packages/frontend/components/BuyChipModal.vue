<script lang="ts" setup>
import { Chip } from "~~/data/chips";

const props = defineProps<{
  modelValue: boolean;
  chip: Chip;
}>();
const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const trpc = useTRPC();
const { showHint } = useHint();
const { coins } = useAuth();

const chip = toRef(props, "chip");
const error = ref("");

function cancel() {
  isOpen.value = false;
}

function buy() {
  trpc.chip.buy
    .mutate({
      id: chip.value.id,
    })
    .then((result) => {
      if ("error" in result) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        error.value = result.error!;
      } else {
        if ("team" in result) {
          setTeam(result.team);
        }
        if ("metadata" in result && result.metadata.hint) {
          setTimeout(
            () =>
              showHint(
                result.team.currentTask?.title ?? "",
                result.metadata.hint as string
              ),
            1000
          );
        }
        isOpen.value = false;
      }
    })
    .catch(() => {
      error.value = "Unexpected error";
    });
}
</script>

<template>
  <Modal v-model="isOpen">
    <div class="flex flex-col items-center gap-10 text-center">
      <h3 class="font-display text-2xl font-bold text-white">
        Are you sure you want to buy {{ chip.name }}?
      </h3>
      <div class="pb-5 font-body text-base text-white">
        This chip costs {{ chip.coins }} coins. After buying it, you will be
        left with {{ (coins ?? 0) - chip.coins }} coins.
      </div>
      <div v-if="!!error" class="font-body text-base text-error">
        {{ error }}
      </div>
      <div
        class="flex w-full flex-col items-stretch gap-8 sm:flex-row sm:gap-16"
      >
        <LeftPrimaryButton class="flex-1" @click="cancel"
          >Cancel</LeftPrimaryButton
        >
        <PrimaryButton class="flex-1" @click="buy">Buy</PrimaryButton>
      </div>
    </div>
  </Modal>
</template>
