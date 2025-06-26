<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const features = [
    'organizations',
    'inventories',
    'items',
    'teamManagement',
    'apiIntegration',
    'realTimeUpdates',
    'scalableSolution',
    'secureAccess',
  ];
</script>

<template>
  <div>
    <h2 class="text-3xl font-light text-center text-black dark:text-white">
      {{ t('features.title') }}
    </h2>
    <div
      class="w-full mt-4 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4 md:max-lg:hidden"
    >
      <div v-for="feature in features" :key="feature" class="flex flex-col styled-box">
        <h4 class="text-black dark:text-white text-lg mb-2.5">
          {{ t(`features.${feature}.title`) }}
        </h4>
        <p class="text-base text-slate-600 dark:text-slate-400">
          {{ t(`features.${feature}.description`) }}
        </p>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en-US": {
    "features": {
      "title": "💡 Features",
      "organizations": {
        "title": "Organizations",
        "description": "Create and manage your business structure. Invite team members and assign role-based permissions for secure access control."
      },
      "inventories": {
        "title": "Inventories",
        "description": "Set up multiple inventory locations within your organization. Track stock across warehouses, stores, or any storage space."
      },
      "items": {
        "title": "Items",
        "description": "Add, edit, and monitor individual products. Track quantities, set alerts, and maintain detailed item histories."
      },
      "teamManagement": {
        "title": "Team management",
        "description": "Invite members with secure codes. Assign custom roles and permissions to control who can view and modify inventory data."
      },
      "apiIntegration": {
        "title": "API integration",
        "description": "Generate API keys for IoT devices and custom software. Automate inventory updates and integrate with existing systems."
      },
      "realTimeUpdates": {
        "title": "Real-time updates",
        "description": "See inventory changes instantly across all devices. Keep your team synchronized with live stock level updates."
      },
      "scalableSolution": {
        "title": "Scalable solution",
        "description": "Perfect for any scale—from personal home storage to enterprise warehouses. Grows with your business needs."
      },
      "secureAccess": {
        "title": "Secure access",
        "description": "Control data access with granular permissions. Ensure sensitive inventory information stays protected and organized."
      }
    }
  },
  "hr-HR": {
    "features": {
      "title": "💡 Značajke",
      "organizations": {
        "title": "Organizacije",
        "description": "Stvorite i upravljajte strukturom svog poslovanja. Pozovite članove tima i dodijelite dozvole temeljene na ulogama za sigurnu kontrolu pristupa."
      },
      "inventories": {
        "title": "Skladišta",
        "description": "Postavite više lokacija skladišta unutar vaše organizacije. Pratite zalihe u skladištima, trgovinama ili bilo kojem prostoru za pohranu."
      },
      "items": {
        "title": "Artikli",
        "description": "Dodajte, uredite i pratite pojedinačne proizvode. Pratite količine, postavite upozorenja i održavajte detaljnu povijest artikala."
      },
      "teamManagement": {
        "title": "Upravljanje timom",
        "description": "Pozovite članove sigurnim kodovima. Dodijelite prilagođene uloge i dozvole kako biste kontrolirali tko može vidjeti i mijenjati podatke o inventaru."
      },
      "apiIntegration": {
        "title": "API integracija",
        "description": "Generirajte API ključeve za IoT uređaje i prilagođeni softver. Automatizirajte ažuriranja inventara i integrirajte s postojećim sustavima."
      },
      "realTimeUpdates": {
        "title": "Ažuriranja u stvarnom vremenu",
        "description": "Vidite promjene inventara trenutno na svim uređajima. Održite svoj tim sinkroniziranim s ažuriranjima razine zaliha uživo."
      },
      "scalableSolution": {
        "title": "Skalabilno rješenje",
        "description": "Savršeno za bilo koji opseg—od osobnog kućnog spremišta do poslovnih skladišta. Raste s potrebama vašeg poslovanja."
      },
      "secureAccess": {
        "title": "Siguran pristup",
        "description": "Kontrolirajte pristup podacima s detaljnim dozvolama. Osigurajte da osjetljive informacije o inventaru ostanu zaštićene i organizirane."
      }
    }
  },
  "it-IT": {
    "features": {
      "title": "💡 Funzionalità",
      "organizations": {
        "title": "Organizzazioni",
        "description": "Crea e gestisci la struttura del tuo business. Invita membri del team e assegna permessi basati sui ruoli per un controllo sicuro degli accessi."
      },
      "inventories": {
        "title": "Inventari",
        "description": "Configura più ubicazioni di inventario all'interno della tua organizzazione. Traccia le scorte in magazzini, negozi o qualsiasi spazio di stoccaggio."
      },
      "items": {
        "title": "Articoli",
        "description": "Aggiungi, modifica e monitora singoli prodotti. Traccia le quantità, imposta avvisi e mantieni cronologie dettagliate degli articoli."
      },
      "teamManagement": {
        "title": "Gestione team",
        "description": "Invita membri con codici sicuri. Assegna ruoli e permessi personalizzati per controllare chi può visualizzare e modificare i dati dell'inventario."
      },
      "apiIntegration": {
        "title": "Integrazione API",
        "description": "Genera chiavi API per dispositivi IoT e software personalizzato. Automatizza gli aggiornamenti dell'inventario e integra con i sistemi esistenti."
      },
      "realTimeUpdates": {
        "title": "Aggiornamenti in tempo reale",
        "description": "Visualizza istantaneamente le modifiche dell'inventario su tutti i dispositivi. Mantieni il tuo team sincronizzato con aggiornamenti live dei livelli di scorte."
      },
      "scalableSolution": {
        "title": "Soluzione scalabile",
        "description": "Perfetto per qualsiasi scala—dal deposito domestico personale ai magazzini aziendali. Cresce con le esigenze del tuo business."
      },
      "secureAccess": {
        "title": "Accesso sicuro",
        "description": "Controlla l'accesso ai dati con permessi granulari. Assicurati che le informazioni sensibili dell'inventario rimangano protette e organizzate."
      }
    }
  }
}
</i18n>
