<script lang="ts" setup>
import { Chip } from "~~/data/chips";

defineEmits<{
  (e: "buy", chip: Chip): void;
}>();
const props = defineProps<{
  chip: Chip;
  disabled: boolean;
}>();

const chip = toRef(props, "chip");
const disabled = toRef(props, "disabled");
</script>

<template>
  <div
    class="flex max-w-sm flex-col items-center gap-8 bg-box bg-fill bg-center bg-no-repeat px-11 py-9"
  >
    <div class="flex w-full items-center gap-5">
      <img class="min-h-[100px] min-w-[100px]" :src="chip.image" />
      <div class="flex flex-col gap-3">
        <div
          class="text-shadow-solid2 font-display text-xl font-bold text-primary"
        >
          {{ chip.name }}
        </div>
        <div class="font-display text-base font-bold text-white">
          {{ chip.coins }} Coins
        </div>
      </div>
    </div>
    <div class="font-body text-base text-white">
      {{ chip.description }}
    </div>
    <PrimaryButton class="mt-auto" :disabled="disabled" @click="$emit('buy')"
      >Buy</PrimaryButton
    >
  </div>
</template>
