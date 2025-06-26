<script setup lang="ts">
  import { ref } from 'vue';
  import Popup from '../ModalPopup.vue';
  import type { Country } from '@/types';
  import axios from 'axios';

  const emit = defineEmits(['closeForm']);

  const countrySearchInput = ref<string>('');
  const countryResults = ref<Country[]>([]);
  const selectedCountryCode = ref<string>();

  const organizationCreationFeedback = ref<{
    feedback: string;
    status?: 'progress' | 'success' | 'failure';
  }>({ feedback: '' });

  const name = ref('');

  async function searchCountries() {
    countryResults.value = await axios
      .get<Country[]>(`/api/countries?filter=${encodeURI(countrySearchInput.value)}`)
      .then(({ data }) => data);

    selectedCountryCode.value = undefined;
  }

  async function createOrganization() {
    if (!selectedCountryCode.value) {
      organizationCreationFeedback.value = {
        feedback: 'Please select a country.',
        status: 'failure',
      };

      return;
    }

    organizationCreationFeedback.value = {
      feedback: 'Creating your organization...',
      status: 'progress',
    };

    organizationCreationFeedback.value = await axios
      .post('/api/organizations', {
        name: name.value,
        countryCode: selectedCountryCode.value,
      })
      .then(() => {
        emit('closeForm');

        return {
          feedback: `You've successfully created ${name.value}. Redirecting you.`,
          status: 'success',
        } as const;
      })
      .catch(() => ({
        feedback: 'We failed to create your organization; please report this issue.',
        status: 'failure',
      }));
  }
</script>

<template>
  <Popup>
    <form @submit.prevent="createOrganization" class="mx-14 my-8">
      <div>
        <h3 class="text-lg font-semibold text-center mb-2 text-slate-900 dark:text-slate-100">
          Create a new organization
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
          Please fill out the following details to create your organization.
        </p>
      </div>

      <div class="flex flex-col space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Organization Name
          </label>
          <input
            id="name"
            v-model="name"
            name="name"
            type="text"
            minlength="3"
            required
            placeholder="My Awesome Business"
            class="mt-1 block w-full rounded-md px-3 py-2 bg-slate-100 border border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="country" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Country
          </label>
          <div class="flex flex-row space-x-2 mt-1">
            <input
              v-model="countrySearchInput"
              name="country-search"
              placeholder="Search..."
              type="search"
              minlength="3"
              class="w-full rounded-md px-3 py-2 bg-slate-100 border border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
            />
            <button
              type="button"
              for="country-search"
              @click.prevent="searchCountries"
              class="bg-teal-500 text-sm text-white rounded-md px-4 py-2 shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-teal-400 dark:hover:bg-teal-500"
            >
              Search
            </button>
          </div>
        </div>

        <p class="text-sm text-slate-500 dark:text-slate-400">
          Select your country from the list of results below.
        </p>

        <select
          v-model="selectedCountryCode"
          name="country"
          id="country"
          class="block w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
          required
        >
          <option disabled v-if="countryResults.length === 0" :value="undefined">No results</option>
          <template v-else>
            <option disabled :value="undefined">Please select a country</option>
            <option
              v-for="country in countryResults"
              :key="country.countryCode"
              :value="country.countryCode"
            >
              {{ country.countryName }}
            </option>
          </template>
        </select>
      </div>

      <p
        v-if="organizationCreationFeedback.status"
        :class="{
          'text-center mt-2': true,
          'text-red-500': organizationCreationFeedback.status === 'failure',
          'text-green-500': organizationCreationFeedback.status === 'success',
          'text-teal-500': organizationCreationFeedback.status === 'progress',
        }"
      >
        {{ organizationCreationFeedback.feedback }}
      </p>

      <div class="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          @click="$emit('closeForm')"
          class="px-4 py-2 font-medium bg-slate-100 text-slate-700 border border-slate-300 rounded-md shadow-sm hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 font-medium text-white bg-teal-500 border border-transparent rounded-md shadow-sm hover:bg-teal-600 dark:bg-teal-500 dark:hover:bg-teal-400 focus:outline-none"
        >
          Create
        </button>
      </div>
    </form>
  </Popup>
</template>
