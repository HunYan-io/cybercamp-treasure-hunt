<script lang="ts" setup>
import { NuxtLink } from "#components";
import { TypedRouteList } from "../.generated";

const props = defineProps<{
  active?: boolean;
  to?: { name: TypedRouteList };
}>();

const component = computed(() => {
  if (props.to) {
    return NuxtLink;
  } else {
    return "a";
  }
});
</script>

<template>
  <component :is="component" :to="props.to" class="relative inline-block">
    <span
      class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-display text-xl font-bold uppercase text-black"
    >
      <slot />
    </span>
    <svg
      width="257"
      height="66"
      viewBox="0 0 257 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M234.561 1.93934L234.121 1.5H233.5H3.5H2V3V43V43.6213L2.43934 44.0607L22.4393 64.0607L22.8787 64.5H23.5H253.5H255V63V23V22.3787L254.561 21.9393L234.561 1.93934Z"
        stroke="black"
        stroke-width="3"
      />
    </svg>
  </component>
</template>
