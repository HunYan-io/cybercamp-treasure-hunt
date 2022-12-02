<script lang="ts" setup>
const { isHintModalOpen, hint } = useHint();
</script>

<template>
  <Modal v-model="isHintModalOpen">
    <div class="flex flex-col items-stretch gap-10 text-center">
      <h3 class="font-display text-2xl font-bold text-white">
        {{ hint.taskTitle }}
      </h3>
      <h4 class="font-display text-xl font-bold text-white">Hint</h4>
      <div class="absolute right-8 top-8">
        <button class="relative h-11 w-11" @click="isHintModalOpen = false">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-white"
          >
            <path
              d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
            />
          </svg>
        </button>
      </div>
      <div class="pb-5 font-body text-base text-white">
        {{ hint.hint }}
      </div>

      <PrimaryButton class="w-full" @click="isHintModalOpen = false"
        >Dismiss</PrimaryButton
      >
    </div>
  </Modal>
</template>
