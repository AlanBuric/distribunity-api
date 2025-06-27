<script lang="ts" setup>
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';
  import { computed, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { type PageResponse, type PublishedBlogPostPreview } from '@/types';
  import { useQuery } from '@/composables/query';
  import LoadingAnimation from '@/components/icons/LoadingAnimation.vue';
  import BlogPostList from '@/components/home/blog/BlogPostList.vue';
  import AddIcon from '@/components/icons/AddIcon.vue';
  import useAuthStore from '@/store/auth';

  const route = useRoute();
  const isApplicationAdmin = useAuthStore().user.isAppAdmin;

  const search = ref('');
  const filter = ref('');
  const page = ref((Number(route.query.page) || 1) - 1);
  const limit = ref(10);
  const query = computed(() => {
    let url = `/api/blog-posts/search`;

    if (isApplicationAdmin) url += '/admin';

    url += `?page=${page.value}&limit=${limit.value}`;

    if (filter.value) url += `&filter=${encodeURIComponent(filter.value)}`;

    return url;
  });

  const { data, isLoading, queryError } = useQuery<PageResponse<PublishedBlogPostPreview>>(query);

  function onSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      filter.value = search.value;
      page.value = 0;
    }
  }
</script>

<template>
  <div class="w-full flex flex-col min-h-dvh">
    <HomeNavigationBar />
    <main class="max-w-screen-2xl w-full mx-auto px-8 flex flex-col items-center">
      <h3 class="font-light text-2xl text-slate-900 dark:text-slate-100 mb-4">
        Distribunity blog posts
      </h3>
      <div class="w-full flex justify-center gap-2 mb-6">
        <input
          name="search"
          placeholder="Search..."
          type="search"
          v-model="search"
          @keydown="onSearchKeydown"
          class="py-1.5 border rounded-lg focus:ring-2 focus:ring-active-link focus:outline-none bg-slate-100 dark:bg-slate-700 dark:text-slate-100 border-slate-300 dark:border-slate-600 scheme-light dark:scheme-dark font-extralight text-sm max-w-md w-full pl-8 pr-2"
        />
        <RouterLink v-if="isApplicationAdmin" class="button-primary" to="/blog-post"
          ><AddIcon /><span>New post</span></RouterLink
        >
      </div>
      <LoadingAnimation v-if="isLoading" class="w-10 mt-4" />
      <p
        v-else-if="queryError"
        class="text-lg font-light text-center mt-6 text-slate-800 dark:text-slate-300"
      >
        Sorry, an error occurred while searching. Please report this issue.
      </p>
      <template v-else>
        <BlogPostList :posts="data!.data" />
        <p
          v-if="page >= Math.ceil(data!.total / limit)"
          class="text-lg font-light text-center mt-6 text-slate-800 dark:text-slate-300"
        >
          You've arrived at the beginning of history!
        </p>
      </template>
      <div class="flex justify-center items-center gap-4 mt-6">
        <select
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus:ring-2 focus:ring-active-link disabled:opacity-50 disabled:pointer-events-none bg-black dark:bg-slate-700 text-white dark:text-white hover:bg-slate-700 dark:hover:bg-slate-900 dark:border-1 dark:border-slate-600 h-10"
          v-model="limit"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <RouterLink
          :disabled="page <= 1"
          class="button-primary"
          :to="{ name: 'blog', query: { page: page - 1 } }"
        >
          Previous
        </RouterLink>

        <RouterLink
          :disabled="data == null || page >= Math.ceil(data.total / limit)"
          class="button-primary"
          :to="{ name: 'blog', query: { page: page + 1 } }"
        >
          Next
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
  input[name='search'] {
    background-image: url('/src/assets/search.svg');
    background-position: 5px 6px;
    background-repeat: no-repeat;
  }
</style>
