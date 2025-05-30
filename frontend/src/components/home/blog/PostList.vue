<script lang="ts" setup>
  import type { BlogPost } from '@/types';

  const props = defineProps<{ posts: BlogPost[] }>();
</script>

<template>
  <div
    v-for="post in props.posts"
    :key="post.id"
    class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-6 rounded-lg w-full max-w-4xl shadow hover:shadow-lg transition-shadow mb-3"
  >
    <h4 class="text-xl font-thin text-gray-900 dark:text-gray-100 mb-2">
      {{ post.title }}
    </h4>
    <span class="text-sm text-gray-500 dark:text-gray-400">{{ post.date.toLocaleDateString() }}</span>
  </div>
</template>
