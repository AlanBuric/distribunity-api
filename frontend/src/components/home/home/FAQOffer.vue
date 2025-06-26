<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>

<template>
  <section class="flex flex-col items-center p-6 my-28">
    <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
      {{ t('faqOfferTitle') }}
    </h2>
    <RouterLink class="text-lg button-primary" to="/resources">
      {{ t('visitFaq') }}
    </RouterLink>
  </section>
</template>

<i18n>
{
  "en-US": {
    "faqOfferTitle": "Looking for something else?",
    "visitFaq": "Visit FAQ ➝"
  },
  "hr-HR": {
    "faqOfferTitle": "Tražite ostale informacije?",
    "visitFaq": "Posjetite FAQ ➝"
  },
  "it-IT": {
    "faqOfferTitle": "Cerchi qualcos'altro?",
    "visitFaq": "Visita le FAQ ➝"
  }
}
</i18n>
