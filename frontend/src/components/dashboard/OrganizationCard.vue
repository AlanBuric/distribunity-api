<script setup lang="ts">
  import useAuthStore from '@/store/auth';
  import type { Organization } from '@/types';
  import axios from 'axios';

  const props = defineProps<{ organization: Organization }>();
  const auth = useAuthStore();

  async function leaveOrganization() {
    if (!confirm(`Are you sure you want to leave the organization ${props.organization.name}?`)) {
      return;
    }

    axios.post(`/api/organizations/${props.organization.organizationId}/leave`);
  }

  async function deleteOrganization() {
    axios.delete(
      `/api/organization/${props.organization.organizationId}/member/${auth.user.userId}`,
    );
  }
</script>

<template>
  <div class="block w-full md:w-1/3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
    <div>
      <h3 class="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
        {{ organization.name }}
      </h3>
      <h3
        class="text-2xl uppercase font-light text-slate-300 dark:text-slate-700 bg-blue-300 dark:bg-blue-900"
      >
        {{ organization.ownerId == auth.user.userId ? 'OWNED' : 'JOINED' }}
      </h3>
    </div>
    <h6 class="text-lg font-medium text-slate-600 dark:text-slate-400">
      {{ organization.countryCode }}
    </h6>

    <div class="mt-4 flex space-x-2">
      <RouterLink
        :to="`/work/organization/${organization.organizationId}/inventories`"
        class="text-sm bg-slate-200 text-slate-900 px-3 py-2 rounded-lg dark:bg-slate-600 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 hover:shadow-sm transition-shadow transform hover:scale-105"
      >
        Go to inventories
      </RouterLink>
      <RouterLink
        :to="`/work/organization/${organization.organizationId}`"
        v-if="organization.ownerId === auth.user.userId"
        class="text-sm bg-slate-200 text-slate-900 px-3 py-2 rounded-lg dark:bg-slate-600 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 hover:shadow-sm transition-shadow transform hover:scale-105"
      >
        Admin page
      </RouterLink>
      <button
        v-if="organization.ownerId == auth.user.userId"
        @click="deleteOrganization()"
        class="text-red-600 hover:text-red-800 text-sm font-semibold px-2 py-1 hover:shadow-md transition-shadow transform hover:scale-105"
      >
        Delete
      </button>
      <button
        v-else
        @click="leaveOrganization()"
        class="text-red-600 hover:text-red-800 text-sm font-semibold px-2 py-1 hover:shadow-md transition-shadow transform hover:scale-105"
      >
        Leave
      </button>
    </div>
  </div>
</template>
