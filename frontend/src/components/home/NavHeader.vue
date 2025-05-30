<script lang="ts" setup>
  import Logo from '../icons/BrandLogo.vue';
</script>

<template>
  <RouterLink
    to="/"
    class="w-fit"
  >
    <header
      title="Take me back home"
      class="flex pl-1 rounded hover:bg-gray-200 dark:hover:bg-gray-900"
    >
      <Logo width="4.5em" />
      <div class="flex flex-col justify-center px-4 py-2">
        <h1 class="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100">
          Distribunity
        </h1>
        <p
          id="title-quote"
          class="text-gray-700 dark:text-gray-300"
        >
          Inventory management done right.
        </p>
      </div>
    </header>
  </RouterLink>
</template>
