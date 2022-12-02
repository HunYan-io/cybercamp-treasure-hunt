<script lang="ts" setup>
import { NuxtLink } from "#components";
import { TypedRouteList } from "~~/.generated";
import { TypedRouteLocationRaw } from "~~/.generated/typed-router";

const props = defineProps<{
  active?: boolean;
  to?: TypedRouteLocationRaw<TypedRouteList>;
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
  <component
    :is="component"
    :to="props.to"
    class="cursor-pointer py-4 font-display text-xl font-bold uppercase text-white transition-all duration-300 hover:text-primary"
    :class="{
      'text-shadow-solid2': props.active,
      'text-primary': props.active,
    }"
  >
    <slot />
  </component>
</template>
