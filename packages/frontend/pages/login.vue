<script setup>
useNonAuthGuard();
useNavbar({
  logoAction: {
    to: { name: "index" },
  },
  items: [
    {
      name: "Home",
      to: { name: "index" },
    },
    {
      name: "About",
      to: { name: "index", hash: "#about" },
    },
    {
      name: "Sign Up",
      to: { name: "register" },
      button: "primary",
    },
  ],
});
const { router, routes } = useTypedRouter();
const trpc = useTRPC();

const nickname = ref("");
const password = ref("");

const error = ref("");

watch(
  () => [nickname.value, password.value],
  () => {
    if (error.value) {
      error.value = "";
    }
  },
  { deep: true }
);

function login() {
  if (!nickname.value || !password.value) {
    error.value = "Please fill out all fields";
    return;
  }
  trpc.auth.login
    .mutate({
      nickname: nickname.value,
      password: password.value,
    })
    .then(({ user, team }) => {
      setAuth({ user, team });
      router.push({ name: routes.team });
    })
    .catch((err) => {
      if (isTRPCClientError(err)) {
        if (err.data?.code === "UNAUTHORIZED") {
          error.value = "Invalid nickname/password combination";
        }
      }
    });
}
</script>

<template>
  <main
    class="container flex flex-1 flex-col items-center justify-center gap-14 py-32 text-center"
  >
    <h2 class="font-display text-4xl font-bold text-white">
      Log in to your account
    </h2>
    <form
      class="flex w-full max-w-md flex-col items-stretch gap-10 px-12"
      @submit.prevent="login"
    >
      <TextField
        id="nickname"
        v-model="nickname"
        name="nickname"
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
    <PrimaryButton @click="login">Login</PrimaryButton>
  </main>
</template>
