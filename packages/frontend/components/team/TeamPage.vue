<script lang="ts" setup>
const isSignoutModalOpen = ref(false);
useNavbar({
  logoAction: { to: { name: "team" } },
  items: [
    {
      name: "Sign Out",
      onClick: () => {
        isSignoutModalOpen.value = true;
      },
    },
  ],
});
</script>

<template>
  <main
    class="container flex flex-1 flex-col items-center justify-center gap-20 py-10"
  >
    <h2 class="text-center font-display text-4xl font-bold text-white">
      Create your account
    </h2>
    <div
      class="flex max-w-xl flex-col items-stretch gap-16 sm:w-full sm:flex-row"
    >
      <LeftPrimaryButton class="flex-1" :to="{ name: 'team-join' }">
        Join team
      </LeftPrimaryButton>
      <PrimaryButton class="flex-1" :to="{ name: 'team-create' }">
        Create team
      </PrimaryButton>
    </div>
    <SignoutModal v-model="isSignoutModalOpen" />
  </main>
</template>
