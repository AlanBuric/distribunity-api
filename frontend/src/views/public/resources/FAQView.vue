<script setup lang="ts">
  const content = [
    {
      question: 'What is Distribunity?',
      answer:
        'Distribunity is a web application designed to manage and monitor the inventory of a company\'s warehouse. It simplifies tracking by maintaining a single source of truth for inventory data.',
    },
    {
      question: 'How does Distribunity differ from traditional methods?',
      answer:
        'Distribunity prevents issues like redundant versions and data discrepancies by using a centralized database that synchronizes all updates in real-time.',
    },
    {
      question: 'Who can benefit from Distribunity?',
      answer:
        'Distribunity is useful for businesses of all sizes, including warehouses, stores, online shops, and individuals managing personal household inventories.',
    },
    {
      question: 'Is Distribunity free to use?',
      answer:
        'Yes, Distribunity is currently free to use. The application operates on Firebase’s free tier, which allows a limited number of requests per day. However, if the user base grows significantly, upgrading to a paid plan may be required to accommodate larger traffic.',
    },
    {
      question: 'How do I use Distribunity?',
      answer:
        'To start using Distribunity, you need to create an account, after which you can create an organization and start managing your inventory. You can invite other users to your organization, assign roles, and set permissions for different levels of access.',
    },
    {
      question: 'What features does Distribunity offer?',
      answer:
        'Distribunity provides CRUD operations on items and warehouses, real-time updates, user management, and role-based access control.',
    },
    {
      question: 'Can I export or import data in Distribunity?',
      answer:
        'Currently, export/import functionality is planned but not yet available. In the future, users will be able to migrate data via CSV or Excel.',
    },
    {
      question: 'Can Distribunity integrate with other systems?',
      answer:
        'Not yet, but future updates may include integration with external APIs and services for automated processes.',
    },
    {
      question: 'What are the future plans for Distribunity?',
      answer:
        'Future updates may include integration with APIs, internationalization, advanced analytics, and more granular user role management.',
    },
    {
      question: 'Where can I report issues for Distribunity?',
      answer:
        'Support is available through documentation and user guides on the website, you can contact the support team for further assistance, and report errors at our GitHub repository\'s Issues tab; find the links at the bottom of the page.',
    },
  ];
</script>
<template>
  <main class="max-w-screen-xl w-full mx-auto p-8 flex flex-col items-center dark:bg-gray-800 bg-gray-100 text-gray-900 dark:text-white rounded-lg">
    <header class="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
      <h1 class="text-3xl font-bold">
        Distribunity FAQ
      </h1>
    </header>

    <div class="px-6 py-8 w-full mx-auto">
      <ol>
        <li v-for="(faq, index) in content" :key="index" class="mb-8 list-decimal list-inside marker:text-xl">
          <h2 class="text-xl font-semibold mb-2 inline-block">
            {{ faq.question }}
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            {{ faq.answer }}
          </p>
        </li>
      </ol>
    </div>
  </main>
</template>
