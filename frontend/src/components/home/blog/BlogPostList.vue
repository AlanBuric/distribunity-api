<script lang="ts" setup>
  import useGlobalStore from '@/store/global';
  import type { PublishedBlogPostPreview } from '@/types';

  const props = defineProps<{ posts: PublishedBlogPostPreview[] }>();
  const locale = useGlobalStore().language;
</script>

<template>
  <div v-for="post in props.posts" :key="post.blogPostId" class="w-full max-w-4xl styled-box">
    <h4 class="text-lg font-light text-slate-900 dark:text-slate-100 mb-2">
      {{ post.title }}
    </h4>
    <span class="text-sm italic text-slate-500 dark:text-slate-400">{{
      'Published on ' +
      new Date(post.updatedAt).toLocaleDateString(locale) +
      (post.authorName ? ', written by ' + post.authorName : '') +
      '.'
    }}</span>
    <p class="text-sm text-slate-700 dark:text-slate-300">{{ post.description }}</p>
  </div>
</template>
