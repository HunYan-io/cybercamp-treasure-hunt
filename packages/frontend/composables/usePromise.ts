import { UnwrapRef } from "vue";

export default function usePromise<T>(promise: Promise<UnwrapRef<T>>) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(true);
  promise
    .then((v) => {
      data.value = v;
      loading.value = false;
    })
    .catch((e) => {
      error.value = e;
      loading.value = false;
    });

  return {
    data,
    error,
    loading,
  };
}
