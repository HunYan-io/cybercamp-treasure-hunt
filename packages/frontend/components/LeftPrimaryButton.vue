<script lang="ts" setup>
import { NuxtLink } from "#components";
import { TypedRouteList } from "~~/.generated";
import { TypedRouteLocationRaw } from "~~/.generated/typed-router";

const props = defineProps<{
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
    class="group inline-flex cursor-pointer"
  >
    <div class="flex flex-col">
      <div
        class="w-5 flex-1 bg-primary shadow-solidn4 transition-all group-hover:shadow-solidn2"
      ></div>
      <div class="relative">
        <div
          class="absolute top-1 -left-1 -z-20 h-0 w-0 border-r-[20px] border-b-[20px] border-b-transparent border-r-secondary transition-all group-hover:top-0.5 group-hover:-left-0.5"
        ></div>
        <div
          class="h-0 w-0 border-r-[20px] border-b-[20px] border-b-transparent border-r-primary"
        ></div>
      </div>
    </div>
    <div
      class="-z-10 flex-1 bg-primary py-4 pr-10 pl-5 text-center font-display text-xl font-bold uppercase text-black shadow-solidn4 transition-all group-hover:shadow-solidn2"
    >
      <slot />
    </div>
  </component>
</template>
