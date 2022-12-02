<script lang="ts" setup>
const props = defineProps<{
  countingSince?: Date;
  duration?: number;
  frozenAt?: Date;
}>();

const countingSince = toRef(props, "countingSince");
const duration = toRef(props, "duration");
const frozenAt = toRef(props, "frozenAt");

const minutesLeft = ref("--");
const secondsLeft = ref("--");

const fn = () => {
  if (typeof duration.value !== "number") {
    minutesLeft.value = "--";
    secondsLeft.value = "--";
    return;
  }
  if (!countingSince.value) {
    const minutes = Math.floor(duration.value / 1000 / 60);
    const seconds = Math.floor((duration.value / 1000) % 60);
    minutesLeft.value = minutes.toString().padStart(2, "0");
    secondsLeft.value = seconds.toString().padStart(2, "0");
    return;
  }
  const countingUntilTime =
    frozenAt.value?.getTime() ?? countingSince.value.getTime() + duration.value;
  const timeLeft = countingUntilTime - Date.now();
  if (timeLeft <= 0) {
    minutesLeft.value = "00";
    secondsLeft.value = "00";
    return;
  }
  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  minutesLeft.value = minutes.toString().padStart(2, "0");
  secondsLeft.value = seconds.toString().padStart(2, "0");
};

fn();

useIntervalFn(fn, 1000);
</script>

<template>{{ minutesLeft }}:{{ secondsLeft }}</template>
