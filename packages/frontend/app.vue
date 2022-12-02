<script lang="ts" setup>
const route = useRoute();
const { routes } = useTypedRouter();

const { bodyOverflowHidden } = useOverflow();

useHead({
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Ubuntu&display=swap",
      rel: "stylesheet",
    },
  ],
  bodyAttrs: () => ({
    class: `font-body overflow-x-hidden text-white bg-black${
      bodyOverflowHidden.value ? " overflow-y-hidden" : ""
    }`,
  }),
});

function onNavbarToggle(isOpen: boolean) {
  bodyOverflowHidden.value = isOpen;
}

const isIndexPage = computed(() => {
  return route.name === routes.index;
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar @toggle="onNavbarToggle" />
    <NuxtPage />
    <footer
      v-if="isIndexPage"
      class="container flex flex-col items-center gap-4 py-6 text-center font-display text-xs font-bold"
    >
      <p>This event was brought to you by Securinets INSAT</p>
      <p>Website made with ♥ by Heni Yangui</p>
    </footer>
  </div>
</template>
