<script setup lang="ts">
  import { database, auth } from '@/firebase/init';
  import { collection, query, where, limit, getDocs, writeBatch, arrayRemove, arrayUnion, doc } from 'firebase/firestore';
  import { ref } from 'vue';

  const invitationCode = ref<string>();
  const invitationStatus = ref<{ text: string, status?: 'progress' | 'success' | 'not-found' }>({ text: '' });

  async function joinOrganization() {
    invitationStatus.value = {
      text: 'Searching for organizations...',
      status: 'progress',
    };

    invitationCode.value = invitationCode.value?.toUpperCase();
    const organizationsRef = collection(database, 'organizations');
    const queryOrgsWithCode = query(organizationsRef, where('invites', 'array-contains', invitationCode.value), limit(1));

    try {
      const snapshot = await getDocs(queryOrgsWithCode);

      if (snapshot.size == 0) {
        setInvitationFailure();
        return;
      }

      const targetOrganization = snapshot.docs[0];
      const batch = writeBatch(database);

      batch.update(targetOrganization.ref, { invites: arrayRemove(invitationCode.value) });
      batch.set(doc(targetOrganization.ref, 'members', auth.currentUser!.uid), { roles: [], joined: Date.now() });
      batch.update(doc(database, 'users', auth.currentUser!.uid), { organizations: arrayUnion(targetOrganization.ref) });

      await batch.commit();

      invitationStatus.value = {
        text: `You've joined ${targetOrganization.data().name}`,
        status: 'success',
      };
    } catch (ignored) {
      setInvitationFailure();
    }
  }

  function setInvitationFailure() {
    invitationStatus.value = {
      text: 'Organization not found with that invitation code.',
      status: 'not-found',
    };
  }
  </script>

<template>
  <form class="md:w-1/3 space-y-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" @submit.prevent="joinOrganization">
    <input
      v-model="invitationCode"
      placeholder="Invitation code"
      class="w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 appearance-none dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-active-link"
      pattern="[A-Za-z0-9]{6,}"
      required
    >
    <p class="text-sm text-gray-400">
      The invitation code is at least 6 characters long, composed of Latin letters and/or numbers, usually given to you by an organization manager.
    </p>
    <button
      type="submit"
      class="w-full px-3 py-2 text-white rounded bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
      :disabled="!invitationCode || invitationCode.length === 0"
    >
      Join an organization
    </button>
    <p
      v-if="invitationStatus.status" :class="{
        'text-center mt-4': true,
        'text-red-500': invitationStatus.status === 'not-found',
        'text-green-500': invitationStatus.status === 'success',
        'text-teal-500': invitationStatus.status === 'progress'
      }"
    >
      {{ invitationStatus.text }}
    </p>
  </form>
</template>
