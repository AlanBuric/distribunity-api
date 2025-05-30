<script lang="ts" setup>
  import type { Item } from '@/types';

  defineEmits<{ closeForm: [] }>();
  const props = defineProps<{ selectedItem: Item }>();
</script>

<template>
  <aside class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 flex flex-col">
    <h1 class="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">
      Item details: {{ props.selectedItem.name }}
    </h1>

    <img v-if="selectedItem.iconURL" :src="selectedItem.iconURL" class="max-w-48 shadow-md border-gray-300 rounded-md">

    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</span>
      <p class="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-300">
        {{ props.selectedItem.name }}
      </p>
    </div>

    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Unit</span>
      <p class="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-300">
        {{ props.selectedItem.unit || '(None)' }}
      </p>
    </div>

    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</span>
      <p class="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-300">
        ${{ props.selectedItem.unitPrice.toFixed(2) }}
      </p>
    </div>

    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</span>
      <p class="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-300">
        {{ props.selectedItem.quantity }}
      </p>
    </div>

    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Photo link</span>
      <p class="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-300">
        {{ props.selectedItem.iconURL || "(None)" }}
      </p>
    </div>

    <div class="flex flex-col">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Attributes</span>
      <p v-if="props.selectedItem.attributes.length == 0" class="text-sm font-medium text-gray-600 dark:text-gray-400">
        This item has no attributes.
      </p>
      <ul v-else class="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-300 space-y-2">
        <li v-for="(attribute, index) in props.selectedItem.attributes" :key="index">
          <span v-if="typeof attribute === 'string'">{{ attribute }}</span>
          <span v-if="typeof attribute === 'object'">{{ Object.keys(attribute)[0] }}: {{ Object.values(attribute)[0] }}</span>
        </li>
      </ul>
    </div>

    <button
      @click="$emit('closeForm')"
      class="self-start px-4 py-2 font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none"
    >
      Close
    </button>
  </aside>
</template>
