<script setup lang="ts">
  import { auth, database } from '@/firebase/init';
  import { arrayUnion, doc, writeBatch } from 'firebase/firestore';
  import { ref } from 'vue';
  import Popup from '../ModalPopup.vue';
  import { filterCountriesByName } from '@/scripts/country-search';
  import { type CountryData, type RestCountriesCountry } from '@/types';
  import { firestoreAutoId } from '@/scripts/firebase-utilities';

  const emit = defineEmits(['closeForm']);
  const countrySearchInput = ref<string>('');
  const countryResults = ref<RestCountriesCountry[]>([]);
  const selectedCountry = ref<CountryData>();

  async function searchCountries() {
    countryResults.value = await filterCountriesByName(countrySearchInput.value);
    // Reset the current input to empty string so that it defaults to the default disabled value.
    selectedCountry.value = undefined;
  };

  const organizationCreationFeedback = ref<{
    feedback: string
    status?: 'progress' | 'success' | 'failure'
  }>({ feedback: '' });

  const name = ref('');

  async function createOrganization() {
    if (!auth.currentUser?.uid) {
      organizationCreationFeedback.value = {
        feedback: 'We failed to authenticate you. Sign out and sign back in to try again, otherwise report this issue if it persists.',
        status: 'failure',
      };

      return;
    } else if (!selectedCountry.value) {
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

    try {
      const batch = writeBatch(database);
      const organizationId = firestoreAutoId();
      const newOrganizationRef = doc(database, 'organizations', organizationId);
      const ownerRef = doc(database, 'users', auth.currentUser.uid);

      batch.set(newOrganizationRef, {
        name: name.value,
        owner: ownerRef,
        invites: [],
        countryCode: selectedCountry.value.countryCode,
        country: selectedCountry.value.country,
      });

      batch.set(doc(database, 'organizations', organizationId, 'members', auth.currentUser.uid), { roles: [], joined: Date.now() });

      batch.update(ownerRef, {
        organizations: arrayUnion(newOrganizationRef),
      });

      await batch.commit();

      organizationCreationFeedback.value = {
        feedback: `You've successfully created ${name.value}. Redirecting you.`,
        status: 'success',
      };

      emit('closeForm');
    } catch (ignored) {
      organizationCreationFeedback.value = {
        feedback: 'We failed to create your organization; please report this issue.',
        status: 'failure',
      };
    }
  }
</script>

<template>
  <Popup>
    <form @submit.prevent="createOrganization" class="mx-14 my-8">
      <div>
        <h3 class="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">
          Create a new organization
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Please fill out the following details to create your organization.
        </p>
      </div>

      <div class="flex flex-col space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            class="mt-1 block w-full rounded-md px-3 py-2 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
          >
        </div>

        <div>
          <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Country
          </label>
          <div class="flex flex-row space-x-2 mt-1">
            <input
              v-model="countrySearchInput"
              name="country-search"
              placeholder="Search..."
              type="search"
              minlength="3"
              class="w-full rounded-md px-3 py-2 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
            >
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

        <p class="text-sm text-gray-500 dark:text-gray-400">
          Select your country from the list of results below.
        </p>

        <select
          v-model="selectedCountry"
          name="country"
          id="country"
          class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
          required
        >
          <option disabled v-if="countryResults.length === 0" :value="undefined">
            No results
          </option>
          <template v-else>
            <option disabled :value="undefined">
              Please select a country
            </option>
            <option v-for="country in countryResults" :key="country.cca3" :value="{ countryCode: country.cca3, country: country.name.common }">
              {{ country.name.common }}
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
          class="px-4 py-2 font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none"
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
