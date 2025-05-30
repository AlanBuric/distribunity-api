<template>
  <nav class="flex items-center space-x-3">
    <RouterLink
      to="/"
      class="text-lg text-gray-700 dark:text-gray-400 hover:text-active-link dark:hover:text-active-link"
    >
      Home
    </RouterLink>
    <RouterLink
      to="/resources"
      class="text-lg text-gray-700 dark:text-gray-400 hover:text-active-link dark:hover:text-active-link"
    >
      Help
    </RouterLink>
    <RouterLink
      to="/work/settings"
      class="text-lg text-gray-700 dark:text-gray-400 hover:text-active-link dark:hover:text-active-link"
    >
      Settings
    </RouterLink>
    <RouterLink
      to="/work"
      class="text-lg text-gray-700 dark:text-gray-400 hover:text-active-link dark:hover:text-active-link"
    >
      Dashboard
    </RouterLink>
  </nav>
</template>
