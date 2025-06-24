<script setup lang="ts">
  import type { Organization } from '@/types';

  const props = defineProps<{
    organizationStringRef: string;
  }>();

  const orgRef = doc(database, props.organizationStringRef);
  const orgSnapshot = await getDoc(orgRef);
  const organization: Organization & WithId = {
    ...(orgSnapshot.data() as Organization),
    id: orgSnapshot.id,
  };

  async function leaveOrganization() {
    if (!confirm(`Are you sure you want to leave the organization ${organization.name}?`)) {
      return;
    }

    await updateDoc(doc(database, 'users', auth.currentUser!.uid), {
      organizations: arrayRemove(orgRef),
    });
  }
</script>

<template>
  <div class="block w-full md:w-1/3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
      {{ organization.name }}
    </h3>
    <h6 class="text-lg font-medium text-slate-600 dark:text-slate-400">
      {{ organization.country }}
    </h6>

    <div class="mt-4 flex space-x-2">
      <RouterLink
        :to="`/work/organization/${organization.id}/inventories`"
        class="text-sm bg-slate-200 text-slate-900 px-3 py-2 rounded-lg dark:bg-slate-600 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 hover:shadow-sm transition-shadow transform hover:scale-105"
      >
        Go to inventories
      </RouterLink>
      <RouterLink
        :to="`/work/organization/${organization.id}`"
        v-if="organization.owner.id === auth.currentUser?.uid"
        class="text-sm bg-slate-200 text-slate-900 px-3 py-2 rounded-lg dark:bg-slate-600 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 hover:shadow-sm transition-shadow transform hover:scale-105"
      >
        Admin page
      </RouterLink>
      <button
        v-if="organization.owner.id === auth.currentUser?.uid"
        @click="deleteOrganization(organization)"
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
