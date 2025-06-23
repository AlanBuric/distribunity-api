<script lang="ts" setup>
  import { RouterLink } from 'vue-router';
  import Logo from '../icons/BrandLogo.vue';
  import GithubIcon from '../icons/GithubIcon.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>

<template>
  <footer
    class="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-between p-8 flex-1 mt-4 w-full border-t border-gray-300 dark:border-gray-700"
  >
    <div
      id="footer-links"
      class="max-w-screen-2xl w-full flex flex-col md:flex-row justify-between mb-16 space-y-8 md:space-y-0"
    >
      <section>
        <h3 class="text-xl font-semibold text-black dark:text-gray-100 mb-4">Legal</h3>
        <ul class="space-y-2">
          <li>
            <RouterLink to="/resources" class="hover:text-teal-400 transition duration-300">
              Terms of Service
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/resources" class="hover:text-teal-400 transition duration-300">
              Privacy Policy
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/resources" class="hover:text-teal-400 transition duration-300">
              Cookie Policy
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/resources" class="hover:text-teal-400 transition duration-300">
              Imprint
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>

    <section class="max-w-screen-2xl w-full flex justify-between">
      <div class="flex items-center space-x-6">
        <Logo class="w-10 h-10" />
        <p>
          {{
            t('license') + ' &copy; ' + new Date().getFullYear() + ' Distribunity, ' + t('author')
          }}
        </p>
      </div>
      <a
        class="flex items-center gap-x-2 group"
        href="https://github.com/AlanBuric/distribunity-api"
        target="_blank"
        referrerpolicy="no-referrer"
      >
        <GithubIcon class="w-7 h-7 fill-black dark:fill-white" />
        <span class="group-hover:text-teal-400 transition duration-300">{{ t('gitHubInfo') }}</span>
      </a>
    </section>
  </footer>
</template>

<i18n>
{
  "en-US": {
    "license": "MIT license",
    "author": "author Alan Burić",
    "gitHubInfo": "Source code and contact"
  },
  "hr-HR": {
    "license": "MIT licenca",
    "author": "autor Alan Burić",
    "gitHubInfo": "Izvorni kod i kontakt"
  }
}
</i18n>
