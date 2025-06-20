import axios from 'axios';
import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

export function useQuery<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null);
  const isLoading = ref(true);
  const queryError = ref<any>(null);

  function fetchData() {
    data.value = null;
    isLoading.value = true;

    axios
      .get<T>(toValue(url))
      .then((response) => (data.value = response.data))
      .catch((newError) => (queryError.value = newError))
      .finally(() => (isLoading.value = false));
  }

  watchEffect(fetchData);

  return { data, isLoading, queryError };
}
