<script lang="ts" setup>
const props = defineProps<{
  /**
   * Sets the width of the underline in px. Defaults to 800.
   */
  width?: number;
}>();
</script>

<template>
  <div class="flex flex-col items-stretch gap-[5px]">
    <h3 class="text-shadow-solid2 font-display text-xl font-bold text-primary">
      <slot />
    </h3>
    <div class="overflow-hidden">
      <svg
        class="drop-shadow-solid2"
        :width="props.width ?? 800"
        height="7"
        :viewBox="`0 0 ${props.width ?? 800} 7`"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0V7H41L46.75 1.031L800 1V0.031L0 0Z"
          class="fill-primary"
        />
      </svg>
    </div>
  </div>
</template>
