<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean;
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

const { user, team } = useAuth();
const trpc = useTRPC();
const { router, routes } = useTypedRouter();

function cancel() {
  isOpen.value = false;
}

function signout() {
  trpc.auth.logout.mutate().then(() => {
    user.value = null;
    team.value = null;
    isOpen.value = false;
    router.push({ name: routes.index });
  });
}
</script>

<template>
  <Modal v-model="isOpen">
    <div class="flex flex-col items-center gap-20 text-center">
      <h3 class="font-display text-2xl font-bold text-white">
        Are you sure you want to sign out?
      </h3>
      <div
        class="flex w-full flex-col items-stretch gap-8 sm:flex-row sm:gap-16"
      >
        <LeftPrimaryButton class="flex-1" @click="cancel"
          >Cancel</LeftPrimaryButton
        >
        <PrimaryButton class="flex-1" @click="signout">Sign out</PrimaryButton>
      </div>
    </div>
  </Modal>
</template>
