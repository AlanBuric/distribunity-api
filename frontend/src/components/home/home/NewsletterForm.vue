<script lang="ts" setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const submitted = ref(false);
  const email = ref();

  function signupForNewsLetter() {
    axios
      .post('/api/newsletter', { email: email.value })
      .catch(() => alert(t('alreadySignedUp')))
      .finally(() => (submitted.value = true));
  }
</script>

<template>
  <section class="flex flex-col items-center p-6">
    <h2 v-if="submitted" class="text-2xl font-semibold text-green-500 dark:text-green-400">
      {{ t('thankYou') }}
    </h2>
    <template v-else>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {{ t('newsletterTitle') }}
        </h2>
        <p class="text-lg text-slate-700 dark:text-slate-300">
          {{ t('newsletterDescription') }}
        </p>
      </div>
      <form @submit.prevent="signupForNewsLetter" class="w-full max-w-md">
        <input
          v-model="email"
          class="custom-input w-full mb-4 px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-active-link focus:outline-none bg-slate-100 dark:bg-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600"
          type="email"
          name="email"
          autocomplete="email"
          :placeholder="t('emailPlaceholder')"
          required
        />
        <div class="mb-4 flex items-center">
          <input
            type="checkbox"
            id="agreement"
            name="agreement"
            class="form-checkbox h-5 w-5 text-teal-500 dark:text-teal-400"
            required
          />
          <label for="agreement" class="ml-3 text-slate-700 dark:text-slate-300 text-sm">
            {{ t('agreementText') }}
          </label>
        </div>
        <div class="flex gap-x-3 justify-center">
          <button type="submit" class="text-lg button-primary">{{ t('subscribe') }}</button>
          <slot />
        </div>
      </form>
    </template>
  </section>
</template>

<i18n>
{
  "en-US": {
    "thankYou": "Thank you for subscribing to our newsletter!",
    "newsletterTitle": "Sign up for our newsletter",
    "newsletterDescription": "Subscribe to our journey on becoming a favored choice for businesses.",
    "emailPlaceholder": "Your e-mail",
    "agreementText": "I allow Distribunity to save my e-mail for sending me promotions and educational content, and have the right to cancel my subscription any time.",
    "subscribe": "Subscribe",
    "alreadySignedUp": "You've already signed up for the newsletter!"
  },
  "hr-HR": {
    "thankYou": "Hvala što ste se pretplatili na naš newsletter!",
    "newsletterTitle": "Prijavite se na naš newsletter",
    "newsletterDescription": "Pretplatite se na naše putovanje prema tome da postanemo omiljeni izbor za poduzeća.",
    "emailPlaceholder": "Vaš e-mail",
    "agreementText": "Dozvoljavam Distribunityju da spremi moj e-mail za slanje promotivnog i edukativnog sadržaja, te imam pravo otkazati pretplatu u bilo kojem trenutku.",
    "subscribe": "Pretplati se",
    "alreadySignedUp": "Već ste se prijavili na newsletter!"
  },
  "it-IT": {
    "thankYou": "Grazie per esserti iscritto alla nostra newsletter!",
    "newsletterTitle": "Iscriviti alla nostra newsletter",
    "newsletterDescription": "Iscriviti al nostro viaggio per diventare una scelta preferita per le aziende.",
    "emailPlaceholder": "La tua e-mail",
    "agreementText": "Autorizzo Distribunity a salvare la mia e-mail per inviarmi promozioni e contenuti educativi, e ho il diritto di annullare l'iscrizione in qualsiasi momento.",
    "subscribe": "Iscriviti",
    "alreadySignedUp": "Sei già iscritto alla newsletter!"
  }
}
</i18n>
