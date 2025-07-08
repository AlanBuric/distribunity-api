<script setup lang="ts">
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';
  import { VueMarkdown } from '@crazydos/vue-markdown';
  import axios from 'axios';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { t } = useI18n();

  const title = ref('');
  const description = ref('');
  const content = ref('');
  const showAuthor = ref(false);

  function createBlogPost(isDraft: boolean) {
    axios
      .post('/api/blog-posts', {
        title: title.value,
        description: description.value,
        content: content.value,
        showAuthor: false,
        isDraft,
      })
      .then(() => router.push('/blog'))
      .catch((error) => alert('An error occurred or something was invalid: ' + error));
  }
</script>

<template>
  <div class="w-full flex flex-col min-h-dvh">
    <HomeNavigationBar />
    <div class="max-w-screen-lg w-full mx-auto px-8 flex flex-col items-center gap-4">
      <h1 class="font-light text-2xl text-slate-900 dark:text-slate-100">{{ t('newBlogPost') }}</h1>
      <div class="w-full flex flex-col">
        <label for="title" class="text-slate-900 dark:text-slate-100 text-lg">{{
          t('title')
        }}</label>
        <input
          id="title"
          name="title"
          v-model="title"
          minlength="1"
          class="w-full max-w-screen-sm styled-input mt-2"
          placeholder="The Hidden Costs of Manual Inventory: Why Your Business Is Bleeding Money"
        />
      </div>
      <div class="w-full flex flex-col">
        <label class="text-slate-900 dark:text-slate-100 text-lg">{{ t('description') }}</label>
        <textarea
          v-model="description"
          minlength="1"
          class="w-full max-w-screen-md styled-input mt-2"
          placeholder="Let's uncover the true cost of sticking with outdated inventory methods."
        />
      </div>
      <div class="w-full flex items-center space-x-2">
        <input
          type="checkbox"
          v-model="showAuthor"
          name="author-name"
          id="author-name"
          class="dark:scheme-dark"
        />
        <label for="author-name" class="text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ t('showAuthor') }}
        </label>
      </div>
      <div class="w-full">
        <h4 class="text-slate-900 dark:text-slate-100 text-lg mb-2">{{ t('content') }}</h4>
        <div class="flex w-full gap-10 flex-col">
          <div class="w-full">
            <label for="content" class="text-slate-800 dark:text-slate-200 text-sm">{{
              t('markdownContent')
            }}</label>
            <textarea
              name="content"
              id="content"
              minlength="1"
              placeholder="Picture this: It's 2 AM, and you're frantically searching through stacks of spreadsheets, trying to figure out why your bestselling product is out of stock while your warehouse claims it has 50 units. Sound familiar? You're not alone."
              class="styled-input w-full min-h-96 mt-2"
              v-model="content"
            />
          </div>
          <div class="w-full">
            <h5 class="text-slate-800 dark:text-slate-200 text-sm mb-2">{{ t('preview') }}</h5>
            <VueMarkdown
              v-if="content"
              :markdown="content"
              class="prose dark:prose-invert text-slate-900 dark:text-slate-100 styled-box w-full max-w-full wrap-anywhere"
            />
            <p v-else class="text-gray-400 dark:text-gray-500">
              {{ t('previewEmpty') }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button type="submit" class="button-primary" @click="createBlogPost(true)">
          {{ t('saveDraft') }}
        </button>
        <button type="submit" class="button-primary" @click="createBlogPost(false)">
          {{ t('publish') }}
        </button>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en-US": {
    "newBlogPost": "New blog post",
    "title": "Title",
    "description": "Preview description",
    "showAuthor": "Show author name?",
    "content": "Content",
    "markdownContent": "Markdown content",
    "contentPlaceholder": "Picture this: It's 2 AM, and you're frantically searching through stacks of spreadsheets, trying to figure out why your bestselling product is out of stock while your warehouse claims it has 50 units. Sound familiar? You're not alone.",
    "preview": "Preview",
    "previewEmpty": "Start typing to see your post here.",
    "saveDraft": "Save to drafts",
    "publish": "Publish"
  },
  "hr-HR": {
    "newBlogPost": "Novi blog post",
    "title": "Naslov",
    "description": "Opis za pregled",
    "showAuthor": "Prikaži ime autora?",
    "content": "Sadržaj",
    "markdownContent": "Markdown sadržaj",
    "contentPlaceholder": "Zamislite: 2 je ujutro i panično pretražujete hrpe tablica pokušavajući shvatiti zašto je vaš najprodavaniji proizvod nestao sa zaliha dok skladište tvrdi da ih ima 50. Zvuči poznato? Niste jedini.",
    "preview": "Pregled",
    "previewEmpty": "Počnite pisati da biste vidjeli svoj post ovdje.",
    "saveDraft": "Spremi u skice",
    "publish": "Objavi"
  },
  "it-IT": {
    "newBlogPost": "Nuovo post del blog",
    "title": "Titolo",
    "description": "Descrizione anteprima",
    "showAuthor": "Mostra nome autore?",
    "content": "Contenuto",
    "markdownContent": "Contenuto Markdown",
    "contentPlaceholder": "Immagina: sono le 2 di notte e stai freneticamente cercando tra pile di fogli di calcolo per capire perché il tuo prodotto più venduto è esaurito mentre il magazzino afferma di averne 50. Ti suona familiare? Non sei solo.",
    "preview": "Anteprima",
    "previewEmpty": "Inizia a scrivere per vedere qui il tuo post.",
    "saveDraft": "Salva tra le bozze",
    "publish": "Pubblica"
  }
}
</i18n>
