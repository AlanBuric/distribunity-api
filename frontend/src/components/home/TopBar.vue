<script lang="ts" setup>
  import { ref } from 'vue';
  import NavHeader from './NavHeader.vue';
  import NavigationBar from './NavigationBar.vue';

  let settings = localStorage.getItem('settings');
  const showAnnouncement = ref<boolean>(settings ? JSON.parse(settings)['showAnnouncement'] : true);

  function hideAnnouncement() {
    showAnnouncement.value = false;

    let settingsString = localStorage.getItem('settings');
    let settings: any;

    if (settingsString) {
      settings = JSON.parse(settingsString);
      settings['showAnnouncement'] = false;
    } else {
      settings = {
        announcement: false,
      };
    }

    localStorage.setItem('settings', settings);
  }

</script>

<template>
  <div
    role="banner"
    class="bg-white dark:bg-gray-800 fixed w-full flex justify-center shadow-md z-50 py-2 px-4 text-sm"
  >
    <div class="max-w-screen-2xl w-full flex flex-wrap items-center">
      <NavHeader />
      <NavigationBar />
      <div v-if="showAnnouncement" class="max-w-screen-2xl w-full flex items-center bg-yellow-300 py-2 px-3 rounded-md justify-between my-2">
        <p class="text-black text-lg flex-1">
          We're in the process of moving and upgrading our services. Track our progress at our <a href="https://www.github.com/AlanBuric/distribunity" target="_blank">new GitHub repository.</a>
        </p>
        <button class="text-black text-2xl" title="Click to ignore this announcement" @click="hideAnnouncement">
          ×
        </button>
      </div>
    </div>
  </div>
</template>
