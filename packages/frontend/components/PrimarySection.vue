<template>
  <section class="flex w-full flex-col">
    <div
      class="-mb-px h-[37px] w-full bg-block-top-pattern bg-center bg-repeat-x"
    ></div>
    <div class="w-full bg-primary">
      <div class="container py-2.5">
        <slot />
      </div>
    </div>
    <div
      class="-mt-px h-[37px] w-full bg-block-bottom-pattern bg-center bg-repeat-x"
    ></div>
  </section>
</template>
