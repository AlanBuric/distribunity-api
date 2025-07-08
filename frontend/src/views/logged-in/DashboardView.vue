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

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 17) return `Good evening, ${auth.user.firstName}. These are your organizations.`;
    if (hour >= 12) return `Good afternoon, ${auth.user.firstName}. These are your organizations.`;

    return `Good morning ${auth.user.firstName}, these are your organizations.`;
  }
</script>

<template>
  <NewOrganizationFormPopup
    v-if="isOrganizationFormOpen"
    @close-form="isOrganizationFormOpen = false"
  />
  <main class="self-center flex flex-col items-center px-4">
    <div class="max-w-7xl space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-light text-center text-black dark:text-white">
          {{ getGreeting() }}
        </h1>
      </div>

      <div class="w-full flex justify-center items-stretch gap-6">
        <div class="max-w-md flex flex-col gap-y-3 styled-box">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            An organization is a company, business, or even a community, which manages one or more
            inventories.
          </p>
          <button class="button-primary w-full" @click.prevent="isOrganizationFormOpen = true">
            Start an organization
          </button>
        </div>
        <JoinOrganizationForm />
      </div>

      <div class="space-y-2">
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
