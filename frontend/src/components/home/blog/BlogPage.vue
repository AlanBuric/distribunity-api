<script lang="ts" setup>
  import type { BlogPost } from '@/types';
  import PostList from './PostList.vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const props = defineProps<{
    posts: BlogPost[]
    getPageCount: () => number
  }>();

  function focusTopBar() {
    document.getElementById('#top-bar')?.focus();
  }

  function prevPageExists() {
    return parseInt(route.query.page as string) > 1;
  }

  function nextPageExists() {
    return parseInt(route.query.page as string) < props.getPageCount();
  }
</script>

<template>
  <div>
    <PostList :posts="props.posts" />
    <h3
      v-if="!nextPageExists()"
      class="text-lg font-thin text-center mt-6 text-gray-800 dark:text-gray-300"
    >
      You've arrived at the beginning of history!
    </h3>
    <div id="page-controls" class="flex justify-center items-center gap-4 mt-6">
      <RouterLink
        v-if="prevPageExists()"
        class="fancy-button"
        :to="{ name: 'blog', query: { page: parseInt($route.query.page as string) - 1 } }"
      >
        Previous
      </RouterLink>

      <button
        class="fancy-button"
        @click="focusTopBar"
      >
        Back to top
      </button>

      <RouterLink
        v-if="nextPageExists()"
        class="fancy-button"
        :to="{ name: 'blog', query: { page: parseInt($route.query.page as string) + 1 } }"
      >
        Next
      </RouterLink>
    </div>
  </div>
</template>
