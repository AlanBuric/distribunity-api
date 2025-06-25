<script setup lang="ts">
  import LoadingAnimation from '@/components/icons/LoadingAnimation.vue';
  import JoinOrganizationForm from '@/components/dashboard/JoinOrganizationForm.vue';
  import OrganizationCard from '@/components/dashboard/OrganizationCard.vue';
  import NewOrganizationFormPopup from '@/components/popup/NewOrganizationFormPopup.vue';
  import { ref } from 'vue';
  import useAuthStore from '@/store/auth';
  import { useQuery } from '@/composables/query';
  import type { Organization } from '@/types';

  const auth = useAuthStore();
  const isOrganizationFormOpen = ref(false);

  const {
    data: organizations,
    queryError,
    isLoading,
  } = useQuery<Organization[]>('/api/organizations');
</script>

<template>
  <NewOrganizationFormPopup
    v-if="isOrganizationFormOpen"
    @close-form="isOrganizationFormOpen = false"
  />
  <main class="self-center flex flex-col items-center px-4">
    <div class="max-w-7xl space-y-6">
      <div class="space-y-2">
        <h1 class="text-3xl font-light text-center">
          Hello {{ auth.user.firstName }}, these are your organizations
        </h1>

        <h2 class="text-xl font-light text-center text-slate-800 dark:text-slate-200">
          Create or join an organization
        </h2>
      </div>

      <div class="flex flex-wrap justify-center items-stretch gap-6">
        <div class="md:w-1/3 space-y-3 styled-box">
          <button
            class="w-full px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
            @click.prevent="isOrganizationFormOpen = true"
          >
            Create an organization
          </button>
          <p class="text-sm text-slate-500 dark:text-slate-400 text-center">
            An organization is a company, business, or even a community, which manages one or more
            inventories.
          </p>
        </div>
        <JoinOrganizationForm />
      </div>

      <div class="space-y-2">
        <h2 class="text-xl font-light text-center text-slate-800 dark:text-slate-200">
          Joined and owned organizations
        </h2>
        <p class="text-center text-lg text-slate-700 dark:text-slate-400">
          {{
            organizations?.length
              ? 'Manage your organizations here.'
              : "You're not a member of any organization. Consider creating or joining one."
          }}
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-6">
        <Transition mode="out-in" v-if="organizations?.length">
          <Suspense timeout="0">
            <OrganizationCard
              v-for="organization in organizations"
              :key="organization.organizationId"
              :organization="organization"
            />

            <template #fallback>
              <LoadingAnimation class="w-20" />
            </template>
          </Suspense>
        </Transition>
      </div>
    </div>
  </main>
</template>
