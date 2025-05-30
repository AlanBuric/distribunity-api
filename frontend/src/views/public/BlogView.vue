<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import BlogError from '@/components/home/blog/BlogError.vue';
  import BlogPage from '@/components/home/blog/BlogPage.vue';
  import { type BlogPost } from '@/types';

  const route = useRoute();

  var postsPerPage = 10;
  const posts = ref<BlogPost[]>([
    {
      id: '1',
      title: 'Welcome to Distribunity!',
      description: '',
      date: new Date(2024, 3, 7, 12, 0),
    },
    {
      id: '2',
      title: 'Distribunity planned as a Mobile and Desktop application',
      description: '',
      date: new Date(2024, 3, 14, 14, 23),
    },
  ]);

  posts.value = posts.value.sort((obj2, obj1) => obj1.date.getTime() - obj2.date.getTime());

  function getPageCount() {
    return Math.ceil(posts.value.length / postsPerPage);
  }

  function doesPageExist() {
    const page = parseInt(route.query.page as string);
    return page > 0 && page <= getPageCount();
  }
</script>

<template>
  <main class="max-w-screen-2xl w-full mx-auto p-8 flex flex-col items-center bg-gray-200 dark:bg-gray-800 rounded-lg">
    <BlogError
      v-if="!doesPageExist()" error-message="Oops! This page doesn't exist."
      redirect-href="/blog?page=1"
      subtitle="Let's take you back to the beginning."
      class="text-center mt-12"
    />
    <BlogPage
      v-else :posts="posts" :get-page-count="getPageCount"
      :route="route"
    />
  </main>
</template>
