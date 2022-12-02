<script lang="ts" setup>
import { NuxtLink } from "#components";
import { TypedRouteList } from "../.generated";

const props = defineProps<{
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
  <component
    :is="component"
    :to="props.to"
    class="group inline-flex items-stretch"
  >
    <svg
      width="53"
      height="21"
      viewBox="0 0 53 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M48.5 0H53V21H37L48.5 0Z" class="fill-secondary" />
      <path d="M34 21L45.5 0H36.5L25 21H34Z" class="fill-secondary" />
      <path d="M22 21L33.5 0H29L17.5 21H22Z" class="fill-secondary" />
      <path d="M14.5 21L26 0H23.5L12 21H14.5Z" class="fill-secondary" />
      <path d="M9 21L20 0H19L7.5 21H9Z" class="fill-secondary" />
      <path d="M4.5 21L16 0H15L3.5 21H4.5Z" class="fill-secondary" />
      <path d="M0 21L12 0H11.5L0 21H0Z" class="fill-secondary" />
    </svg>
    <div
      class="flex items-center justify-center bg-secondary font-display text-[10px] font-bold uppercase text-black"
    >
      <slot />
    </div>
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 0L4.83333 21H0V0H17Z" class="fill-secondary" />
    </svg>
  </component>
</template>
