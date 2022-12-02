<script lang="ts" setup>
useNavbar({
  hideItems: true,
});
</script>

<template>
  <main class="absolute inset-0 grid place-items-center">
    <div class="spinner">
      <div class="spinner-item"></div>
      <div class="spinner-item"></div>
      <div class="spinner-item"></div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
$size: 150px;
$clr1: theme("colors.primary");
$clr3: theme("colors.white");
$clr5: theme("colors.secondary");

.spinner {
  --animation-duration: 650ms;
  position: relative;
  width: $size;
  height: $size;

  .spinner-item {
    position: absolute;
    width: var(--item-size);
    height: var(--item-size);
    top: calc(50% - var(--item-size) / 2);
    left: calc(50% - var(--item-size) / 2);
    border: 4px solid transparent;
    border-left: 4px solid var(--clr-spinner);
    border-right: 4px solid var(--clr-spinner);
    border-radius: 50%;
    animation: spinner2 var(--animation-duration) linear infinite;

    @keyframes spinner2 {
      to {
        transform: rotate(360deg);
      }
    }
  }

  .spinner-item:nth-of-type(1) {
    --item-size: #{$size};
    --clr-spinner: #{$clr1};
    border-top: 4px solid $clr1;
  }

  .spinner-item:nth-of-type(2) {
    --item-size: calc(#{$size} - 30px);
    --clr-spinner: #{$clr5};
    border-bottom: 4px solid $clr5;
  }

  .spinner-item:nth-of-type(3) {
    --item-size: calc(#{$size} - 60px);
    --clr-spinner: #{$clr3};
    border-top: 4px solid $clr3;
  }
}
</style>
