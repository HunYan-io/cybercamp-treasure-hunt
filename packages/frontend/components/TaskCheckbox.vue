<script lang="ts" setup>
const props = defineProps<{
  checked: boolean;
}>();
</script>

<template>
  <div
    class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-[3px] border-primary drop-shadow-solid2"
    :class="{
      'border-dashed': !props.checked,
      'border-solid': props.checked,
      'bg-primary': props.checked,
    }"
  >
    <svg
      v-if="props.checked"
      width="34"
      height="32"
      viewBox="0 0 34 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_86_6)">
        <path
          d="M4.66699 18.4147L13.8978 27.8333L31.3337 5.33334"
          stroke="black"
          stroke-width="5"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_86_6"
          x="0.166992"
          y="0.833221"
          width="33.667"
          height="30.7969"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2" dy="-2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.231373 0 0 0 0 0.717647 0 0 0 0 0.807843 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_86_6"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_86_6"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>
