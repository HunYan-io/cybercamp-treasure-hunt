<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";

const props = defineProps<{
  modelValue: boolean;
  modalId?: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const breakpoints = useBreakpoints(breakpointsTailwind);

const isSm = breakpoints.smaller("sm");

const { bodyOverflowHidden } = useOverflow();

const router = useRouter();
const route = useRoute();
const hash = computed(() => "#" + (props.modalId ?? "modal"));
watch(isOpen, (value) => {
  if (value) {
    router.push({ hash: hash.value });
    bodyOverflowHidden.value = true;
  } else if (route.hash === hash.value) {
    router.back();
  }
  if (!value) {
    bodyOverflowHidden.value = false;
  }
});
watch(
  () => route.hash,
  (value) => {
    if (value !== hash.value) {
      isOpen.value = false;
    }
  }
);
onUnmounted(() => {
  bodyOverflowHidden.value = false;
});
</script>

<template>
  <Transition
    name="modal"
    :enter-from-class="isSm ? 'slide-in' : 'zoom-in'"
    :leave-to-class="isSm ? 'slide-in' : 'zoom-in'"
    enter-active-class="modal-transition"
    leave-active-class="modal-transition"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-end justify-center bg-white bg-opacity-5 backdrop-blur-sm sm:items-center"
      @click="isOpen = false"
    >
      <div
        class="h-limit relative z-20 flex w-full max-w-full flex-col bg-modal bg-modal-mobile-fill bg-top bg-no-repeat py-10 sm:max-w-2xl sm:bg-fill"
        @click.stop
      >
        <div class="flex-1 overflow-y-auto px-7 py-10 sm:px-16">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.h-limit {
  max-height: calc(100vh - 10rem);
}
.zoom-in {
  opacity: 0;
  > div {
    transform: scale(0);
  }
}

.slide-in {
  opacity: 0;
  > div {
    transform: translateY(100%);
  }
}

.modal-transition {
  transition: all 0.3s ease-in-out;
  > div {
    transition: all 0.3s ease-in-out;
  }
}
</style>
