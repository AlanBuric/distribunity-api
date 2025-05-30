<script lang="ts" setup>
  import { RouterLink } from 'vue-router';
  import Logo from '../icons/BrandLogo.vue';
  import GithubIcon from '../icons/GithubIcon.vue';
</script>

<template>
  <footer class="bg-gray-900 text-gray-300 flex flex-col items-center justify-between p-8">
    <div id="footer-links" class="max-w-screen-2xl w-full flex flex-col md:flex-row justify-between mb-16 space-y-8 md:space-y-0">
      <section>
        <h3 class="text-xl font-semibold text-gray-100 mb-4">
          Legal
        </h3>
        <ul class="space-y-2">
          <li>
            <RouterLink
              to="/resources"
              class="text-gray-400 hover:text-teal-400 transition duration-300"
            >
              Terms of Service
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/resources"
              class="text-gray-400 hover:text-teal-400 transition duration-300"
            >
              Privacy Policy
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/resources"
              class="text-gray-400 hover:text-teal-400 transition duration-300"
            >
              Cookie Policy
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/resources"
              class="text-gray-400 hover:text-teal-400 transition duration-300"
            >
              Imprint
            </RouterLink>
          </li>
        </ul>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-gray-100 mb-4">
          External websites
        </h3>
        <ul class="space-y-2">
          <li>
            <a
              href="https://github.com/AlanBuric/distribunity-firebase"
              target="_blank"
              class="group flex space-x-3 items-center"
            >
              <GithubIcon class="w-8 h-8 fill-white" />
              <p class="text-gray-400 group-hover:text-teal-400 transition duration-300">Source code on GitHub</p>
            </a>
          </li>
        </ul>
      </section>

      <section class="max-w-64">
        <h3 class="text-xl font-semibold text-gray-100 mb-4">
          Contacts
        </h3>
        <a href="https://github.com/AlanBuric/distribunity-firebase/issues" target="_blank" class="group flex space-x-3 items-center">
          <GithubIcon class="flex-2 w-8 h-8 fill-white" />
          <p class="flex-1 text-gray-400 group-hover:text-teal-400 transition duration-300">
            Report issues or request new features at our GitHub Issues page
          </p>
        </a>
      </section>
    </div>

    <section class="max-w-screen-2xl w-full flex flex-col items-center space-y-6">
      <Logo class="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
      <p class="text-gray-400">
        &copy; 2024 Distribunity. All rights reserved.
      </p>
    </section>
  </footer>
</template>
