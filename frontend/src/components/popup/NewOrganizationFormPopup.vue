<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import Popup from '../ModalPopup.vue';
  import type { Country, CurrencyFormat } from '@/types';
  import axios from 'axios';
  import { useQuery } from '@/composables/query';
  import { formatCurrency } from '@/scripts/items';
  import { useI18n } from 'vue-i18n';

  const emit = defineEmits(['closeForm']);

  const { t } = useI18n();
  const { data: countries, queryError, isLoading } = useQuery<Country[]>('/api/countries');
  const selectedCountryCode = ref<string>();
  const currencyFormat = reactive<CurrencyFormat>({
    isSymbolBefore: false,
    decimalSeparator: '.',
    thousandSeparator: ',',
    fractionDigits: 2,
    symbol: '€',
  });

  const organizationCreationFeedback = ref<{
    feedback: string;
    status?: 'progress' | 'success' | 'failure';
  }>({ feedback: '' });

  const name = ref('');

  async function createOrganization() {
    if (!selectedCountryCode.value) {
      organizationCreationFeedback.value = {
        feedback: 'Please select a country.',
        status: 'failure',
      };

      return;
    }

    organizationCreationFeedback.value = {
      feedback: t('feedbackCreating'),
      status: 'progress',
    };

    organizationCreationFeedback.value = await axios
      .post('/api/organizations', {
        name: name.value,
        countryCode: selectedCountryCode.value,
        currencyFormat,
      })
      .then(() => {
        emit('closeForm');

        return {
          feedback: t('feedbackSuccess', { name: name.value }),
          status: 'success',
        } as const;
      })
      .catch(() => ({
        feedback: t('feedbackFailure'),
        status: 'failure',
      }));
  }
</script>

<template>
  <Popup>
    <form @submit.prevent="createOrganization" class="mx-6 my-6">
      <div>
        <h3 class="text-lg font-light text-center mb-2 text-slate-900 dark:text-slate-100">
          {{ t('createOrganizationTitle') }}
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
          {{ t('createOrganizationDescription') }}
        </p>
      </div>

      <div class="flex flex-col space-y-4">
        <div>
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {{ t('organizationName') }}
          </label>
          <input
            id="name"
            v-model="name"
            name="name"
            type="text"
            minlength="3"
            required
            placeholder="My Awesome Business"
            class="styled-input w-full"
          />
        </div>

        <div>
          <label
            for="country"
            class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {{ t('country') }}
          </label>

          <p class="mb-2 text-sm text-slate-500 dark:text-slate-400">
            {{ t('countrySelectDescription') }}
          </p>

          <select
            v-model="selectedCountryCode"
            name="country"
            id="country"
            class="block w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option disabled v-if="queryError || isLoading">{{ t('countrySelectLoading') }}</option>
            <option disabled v-if="countries?.length == 0" :value="undefined">
              {{ t('countrySelectNone') }}
            </option>
            <template v-else>
              <option disabled :value="undefined">{{ t('countrySelectPrompt') }}</option>
              <option
                v-for="country in countries"
                :key="country.countryCode"
                :value="country.countryCode"
              >
                {{ country.countryName }}
              </option>
            </template>
          </select>
        </div>

        <h5 class="text-slate-900 dark:text-slate-100 font-light text-center">
          {{ t('currencyFormatSettings') }}
        </h5>

        <div>
          <label
            for="currency-symbol"
            class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {{ t('currencySymbol') }}
          </label>
          <input
            id="currency-symbol"
            name="currency-symbol"
            v-model="currencyFormat.symbol"
            type="text"
            maxlength="5"
            required
            placeholder="€, $, EUR, USD, BTC..."
            class="styled-input w-full"
          />
        </div>

        <div class="space-x-1">
          <input
            type="checkbox"
            v-model="currencyFormat.isSymbolBefore"
            name="symbol-position"
            id="symbol-position"
          />
          <label
            for="symbol-position"
            class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {{ t('currencySymbolBefore') }}
          </label>
        </div>

        <div>
          <label
            for="thousand-separator"
            class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {{ t('thousandSeparator') }}
          </label>
          <select
            v-model="currencyFormat.thousandSeparator"
            name="thousand-separator"
            id="thousand-separator"
            class="block w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value=",">,</option>
            <option value=".">.</option>
            <option value=" ">space</option>
            <option value="">none</option>
            <option value="_">_</option>
            <option value="-">-</option>
          </select>
        </div>

        <div>
          <label
            for="decimal-separator"
            class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {{ t('decimalSeparator') }}
          </label>
          <select
            v-model="currencyFormat.decimalSeparator"
            name="decimal-separator"
            id="decimal-separator"
            class="block w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value=",">,</option>
            <option value=".">.</option>
          </select>
        </div>

        <div>
          <label
            for="fraction-digits"
            class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {{ t('fractionDigits') }}
          </label>
          <input
            v-model="currencyFormat.fractionDigits"
            name="fraction-digits"
            id="fraction-digits"
            type="number"
            min="0"
            max="8"
            class="w-full styled-input"
            required
          />
        </div>

        <p class="text-slate-900 dark:text-slate-100 font-light">
          {{ t('example') }}: <span>{{ formatCurrency(123456789.1011, currencyFormat) }}</span>
        </p>
      </div>

      <p
        v-if="organizationCreationFeedback.status"
        :class="{
          'text-center mt-2': true,
          'text-red-500': organizationCreationFeedback.status === 'failure',
          'text-green-500': organizationCreationFeedback.status === 'success',
          'text-blue-500': organizationCreationFeedback.status === 'progress',
        }"
      >
        {{ organizationCreationFeedback.feedback }}
      </p>

      <div class="flex justify-center space-x-4 mt-6">
        <button type="button" @click="$emit('closeForm')" class="button-primary">
          {{ t('cancel') }}
        </button>
        <button
          type="submit"
          class="px-4 py-2 font-medium text-sm text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-900 focus:outline-none transition-colors"
        >
          {{ t('create') }}
        </button>
      </div>
    </form>
  </Popup>
</template>

<i18n>
{
  "en-US": {
    "createOrganizationTitle": "Create a new organization",
    "createOrganizationDescription": "Please fill out the following details to create your organization.",
    "organizationName": "Organization name",
    "organizationNamePlaceholder": "My Awesome Business",
    "country": "Country",
    "countrySelectDescription": "Select your country from the list of results below.",
    "countrySelectLoading": "Loading countries...",
    "countrySelectNone": "No results",
    "countrySelectPrompt": "Please select a country",
    "currencyFormatSettings": "Currency format settings",
    "currencySymbol": "Currency symbol",
    "currencySymbolBefore": "Currency symbol is before value",
    "thousandSeparator": "Thousand separator",
    "decimalSeparator": "Decimal separator",
    "fractionDigits": "Fraction digits",
    "example": "Example",
    "cancel": "Cancel",
    "create": "Create",
    "feedbackSelectCountry": "Please select a country.",
    "feedbackCreating": "Creating your organization...",
    "feedbackSuccess": "You've successfully created {name}. Redirecting you.",
    "feedbackFailure": "We failed to create your organization; please report this issue."
  },
  "hr-HR": {
    "createOrganizationTitle": "Stvorite novu organizaciju",
    "createOrganizationDescription": "Molimo ispunite sljedeće podatke za stvaranje organizacije.",
    "organizationName": "Naziv organizacije",
    "organizationNamePlaceholder": "Moje Super Poduzeće",
    "country": "Država",
    "countrySelectDescription": "Odaberite svoju državu s popisa ispod.",
    "countrySelectLoading": "Učitavanje država...",
    "countrySelectNone": "Nema rezultata",
    "countrySelectPrompt": "Odaberite državu",
    "currencyFormatSettings": "Postavke formata valute",
    "currencySymbol": "Simbol valute",
    "currencySymbolBefore": "Simbol valute je ispred iznosa",
    "thousandSeparator": "Razdjeljivač tisućica",
    "decimalSeparator": "Decimalni razdjeljivač",
    "fractionDigits": "Broj decimala",
    "example": "Primjer",
    "cancel": "Odustani",
    "create": "Stvori",
    "feedbackSelectCountry": "Molimo odaberite državu.",
    "feedbackCreating": "Stvaranje vaše organizacije...",
    "feedbackSuccess": "Uspješno ste stvorili {name}. Preusmjeravamo vas.",
    "feedbackFailure": "Nismo uspjeli stvoriti vašu organizaciju; molimo prijavite ovaj problem."
  },
  "it-IT": {
    "createOrganizationTitle": "Crea una nuova organizzazione",
    "createOrganizationDescription": "Compila i seguenti dettagli per creare la tua organizzazione.",
    "organizationName": "Nome dell'organizzazione",
    "organizationNamePlaceholder": "La Mia Azienda Fantastica",
    "country": "Paese",
    "countrySelectDescription": "Seleziona il tuo paese dall'elenco qui sotto.",
    "countrySelectLoading": "Caricamento paesi...",
    "countrySelectNone": "Nessun risultato",
    "countrySelectPrompt": "Seleziona un paese",
    "currencyFormatSettings": "Impostazioni formato valuta",
    "currencySymbol": "Simbolo valuta",
    "currencySymbolBefore": "Il simbolo valuta è prima del valore",
    "thousandSeparator": "Separatore delle migliaia",
    "decimalSeparator": "Separatore decimale",
    "fractionDigits": "Cifre decimali",
    "example": "Esempio",
    "cancel": "Annulla",
    "create": "Crea",
    "feedbackSelectCountry": "Seleziona un paese.",
    "feedbackCreating": "Creazione della tua organizzazione...",
    "feedbackSuccess": "Hai creato con successo {name}. Reindirizzamento in corso.",
    "feedbackFailure": "Non siamo riusciti a creare la tua organizzazione; segnala questo problema."
  }
}
</i18n>
