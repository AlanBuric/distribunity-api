<script setup lang="ts">
  import type { Inventory } from '@/types';

  defineProps<{
    inventories: Inventory[]
    selectedInventoryIndex: number | undefined
  }>();
  defineEmits<{
    deleteInventory: [index: number]
    selectInventory: [index: number]
    renameInventory: [index: number]
  }>();
</script>

<template>
  <table class="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-3 py-2">
          Name
        </th>
        <th scope="col" class="px-3 py-2">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(inventory, index) in inventories" :key="index"
        :class="{
          'hover:bg-gray-50 dark:hover:bg-gray-600': true, 'border-b dark:border-gray-700': index < inventories.length - 1,
          'bg-white dark:bg-gray-800': index != selectedInventoryIndex,
          'bg-gray-50 dark:bg-gray-600': index == selectedInventoryIndex
        }"
        @click.prevent="$emit('selectInventory', index)"
      >
        <td
          scope="row"
          @dblclick.prevent="$emit('renameInventory', index)"
          class="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {{ inventory.name }}
        </td>
        <td scope="row" class="px-3 py-2">
          <div class="space-y-1 flex flex-col items-start">
            <button @click.prevent.stop="$emit('renameInventory', index)">
              Rename ✏️
            </button>
            <button @click.prevent.stop="$emit('deleteInventory', index)">
              Delete 🗑️
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
