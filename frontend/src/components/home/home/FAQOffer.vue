<template>
  <section class="flex flex-col items-center p-6">
    <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
      {{ $t('faqOfferTitle') }}
    </h2>
    <RouterLink class="text-lg fancy-button" to="/resources">
      {{ $t('visitFaq') }}
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
    "faqOfferTitle": "Tražite nešto drugo?",
    "visitFaq": "Posjetite FAQ ➝"
  },
  "it-IT": {
    "faqOfferTitle": "Cerchi qualcos'altro?",
    "visitFaq": "Visita le FAQ ➝"
  }
}
</i18n>
