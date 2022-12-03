<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";
import { NuxtLink, PrimaryButton, TextButton } from "#components";
import { NavbarItem } from "../composables/useNavbar";

const emit = defineEmits<{
  (e: "toggle", isOpen: boolean): void;
}>();

const { items, hideItems, logoAction } = useNavbarState();

const breakpoints = useBreakpoints(breakpointsTailwind);

const isMobile = breakpoints.smaller("lg");

function resolveItemComponent(item: NavbarItem) {
  return item.button === "primary" ? PrimaryButton : TextButton;
}

const isOpen = ref(false);

function toggleNavbar() {
  isOpen.value = !isOpen.value;
}

watch(isMobile, (value) => {
  if (!value && isOpen.value) {
    isOpen.value = false;
  }
});

const logoComponent = computed(() => {
  if (logoAction.value?.to) {
    return NuxtLink;
  } else {
    return "a";
  }
});

function onItemClick(item: NavbarItem) {
  if (isMobile.value) {
    isOpen.value = false;
  }
  if (item.onClick) {
    item.onClick();
  }
}

watch(isOpen, (val) => {
  emit("toggle", val);
});

onUnmounted(() => {
  emit("toggle", false);
});
</script>

<template>
  <header
    class="container flex h-[113px] items-center justify-between transition-all duration-300"
    :class="{
      'bg-black': isOpen,
    }"
  >
    <component
      :is="logoComponent"
      :to="logoAction?.to"
      @click="logoAction?.onClick"
    >
      <img src="~/assets/images/logo.png" alt="logo" class="max-h-full" />
    </component>
    <template v-if="!hideItems">
      <nav class="hidden items-center gap-16 lg:flex">
        <component
          :is="resolveItemComponent(item)"
          v-for="item in items"
          :key="item.name"
          :to="item.to"
          :active="item.active"
          @click="onItemClick(item)"
        >
          {{ item.name }}
        </component>
      </nav>
      <button class="relative flex h-14 w-14 lg:hidden" @click="toggleNavbar">
        <Transition
          name="fade-rotate"
          enter-from-class="opacity-0 rotate-180"
          leave-to-class="opacity-0 -rotate-180"
          enter-active-class="transition-all duration-300"
          leave-active-class="transition-all duration-300"
        >
          <svg
            v-if="!isOpen"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-white"
            width="48"
          >
            <path
              d="M3,8H21a1,1,0,0,0,0-2H3A1,1,0,0,0,3,8Zm18,8H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm0-5H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-white"
          >
            <path
              d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
            />
          </svg>
        </Transition>
      </button>
      <Transition
        name="fade-slide"
        enter-from-class="mobile-nav-hidden"
        leave-to-class="mobile-nav-hidden"
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
      >
        <nav
          v-if="isMobile && isOpen"
          class="absolute top-[113px] left-0 right-0 z-20 flex h-screen flex-col items-center gap-8 bg-black opacity-100"
        >
          <component
            :is="resolveItemComponent(item)"
            v-for="item in items"
            :key="item.name"
            :to="item.to"
            :active="item.active"
            @click="onItemClick(item)"
          >
            {{ item.name }}
          </component>
        </nav>
      </Transition>
    </template>
  </header>
</template>

<style scoped>
.mobile-nav-hidden {
  height: 0vh !important;
  opacity: 0 !important;
}
</style>
