<script lang="ts" setup>
const isSignoutModalOpen = ref(false);
useNavbar({
  logoAction: { to: { name: "team" } },
  items: [
    {
      name: "Join Team",
      to: { name: "team-join" },
      active: true,
    },
    {
      name: "Create Team",
      to: { name: "team-create" },
    },
    {
      name: "Sign Out",
      onClick: () => {
        isSignoutModalOpen.value = true;
      },
    },
  ],
});
const { router, routes } = useTypedRouter();
const trpc = useTRPC();

const name = ref("");
const password = ref("");

const error = ref("");

watch(
  () => [name.value, password.value],
  () => {
    if (error.value) {
      error.value = "";
    }
  },
  { deep: true }
);

function join() {
  if (!name.value || !password.value) {
    error.value = "Please fill out all fields";
    return;
  }
  trpc.team.join
    .mutate({
      name: name.value,
      password: password.value,
    })
    .then((team) => {
      setTeam(team);
      router.push({ name: routes.overview });
    })
    .catch((err) => {
      if (isTRPCClientError(err)) {
        if (err.data?.code === "UNAUTHORIZED") {
          error.value = "Invalid name/password combination";
        }
      }
    });
}
</script>

<template>
  <main
    class="container flex flex-1 flex-col items-center justify-center gap-14 py-32 text-center"
  >
    <h2 class="font-display text-4xl font-bold text-white">Join a Team</h2>
    <form
      class="flex w-full max-w-md flex-col items-stretch gap-10 px-12"
      @submit.prevent="join"
    >
      <TextField
        id="name"
        v-model="name"
        name="name"
        type="text"
        label="Nickname"
      />
      <TextField
        id="password"
        v-model="password"
        name="password"
        type="password"
        label="Password"
      />
      <div v-if="error" class="font-body text-base text-error">
        {{ error }}
      </div>
      <input type="submit" hidden />
    </form>
    <PrimaryButton @click="join">Join</PrimaryButton>
    <SignoutModal v-model="isSignoutModalOpen" />
  </main>
</template>
