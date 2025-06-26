<script setup lang="ts">
  import { ref } from 'vue';

  const invitationCode = ref<string>();
  const invitationStatus = ref<{ text: string; status?: 'progress' | 'success' | 'not-found' }>({
    text: '',
  });

  async function joinOrganization() {
    invitationStatus.value = {
      text: 'Searching for organizations...',
      status: 'progress',
    };

    invitationStatus.value = {
      text: `You've joined ${'Name'}`,
      status: 'success',
    };

    setInvitationFailure();
  }

  function setInvitationFailure() {
    invitationStatus.value = {
      text: 'Organization not found with that invitation code.',
      status: 'not-found',
    };
  }
</script>

<template>
  <form class="max-w-md space-y-3 styled-box" @submit.prevent="joinOrganization">
    <input
      v-model="invitationCode"
      placeholder="Invitation code"
      class="w-full bg-slate-100 dark:bg-slate-700 text-black dark:text-white placeholder-slate-500 appearance-none dark:placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-active-link"
      pattern="[A-Za-z0-9]{6,}"
      required
    />
    <p class="text-sm text-slate-400">
      The invitation code is at least 6 characters long, composed of Latin letters and/or numbers,
      usually given to you by an organization manager.
    </p>
    <button
      type="submit"
      class="w-full px-3 py-2 text-white rounded bg-teal-500 hover:bg-teal-600 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:bg-slate-400"
      :disabled="!invitationCode || invitationCode.length === 0"
    >
      Join an organization
    </button>
    <p
      v-if="invitationStatus.status"
      :class="{
        'text-center mt-4': true,
        'text-red-500': invitationStatus.status === 'not-found',
        'text-green-500': invitationStatus.status === 'success',
        'text-teal-500': invitationStatus.status === 'progress',
      }"
    >
      {{ invitationStatus.text }}
    </p>
  </form>
</template>
