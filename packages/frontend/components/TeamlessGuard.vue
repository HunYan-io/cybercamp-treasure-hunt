<script lang="ts" setup>
const trpc = useTRPC();
const { router, routes } = useTypedRouter();
const { user, team, isLoading } = useAuth();

if (!isLoading.value) {
  if (!user.value) {
    router.push({ name: routes.register });
  } else if (team.value) {
    router.push({ name: routes.overview });
  }
} else {
  trpc.auth.data
    .query()
    .then(({ user: u, team: t }) => {
      user.value = u;
      team.value = t;
      isLoading.value = false;
      if (!u) {
        router.push({ name: routes.register });
      } else if (t) {
        router.push({ name: routes.overview });
      }
    })
    .catch((error) => {
      if (isTRPCClientError(error)) {
        if (error.data?.code === "UNAUTHORIZED") {
          isLoading.value = false;
          router.push({ name: routes.register });
        }
      }
    });
}
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <PageLoading />
    </template>
    <PageLoading v-if="isLoading || !user || team" />
    <slot v-else />
  </ClientOnly>
</template>
