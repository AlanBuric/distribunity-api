<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>

<template>
  <section class="px-5 py-10">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {{ t('title') }}
      </h2>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
        {{ t('description') }}
      </p>
      <RouterLink class="text-lg fancy-button" to="/resources">
        {{ t('learnMore') }}
      </RouterLink>
    </div>
  </section>
</template>

<i18n lang>
{
  "en-US": {
    "title": "Inventory management systems are a necessary part of every business.",
    "description": "From webshops to large-scale warehouses, Distribunity's intent is to digitalize the inventory tracking and bookkeeping process, allowing it to be accessible to select employees at any chosen time and place.",
    "learnMore": "Learn more"
  },
  "hr-HR": {
    "title": "Sustavi za upravljanje skladištima nužni su dio svakog poslovanja.",
    "description": "Od web trgovina do velikih skladišta, cilj Distribunityja je digitalizirati proces praćenja i vođenja zaliha, omogućujući pristup odabranim zaposlenicima u bilo koje vrijeme i na bilo kojem mjestu.",
    "learnMore": "Saznajte više"
  },
  "it-IT": {
    "title": "I sistemi di gestione dell'inventario sono una parte necessaria di ogni azienda.",
    "description": "Dai negozi online ai grandi magazzini, l'obiettivo di Distribunity è digitalizzare il processo di monitoraggio e contabilità dell'inventario, rendendolo accessibile ai dipendenti selezionati in qualsiasi momento e luogo.",
    "learnMore": "Scopri di più"
  }
}
</i18n>
