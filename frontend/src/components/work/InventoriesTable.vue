<script setup lang="ts">
  import type { Inventory } from '@/types';

  defineProps<{
    inventories: Inventory[];
    selectedInventoryIndex: number | undefined;
  }>();
  defineEmits<{
    deleteInventory: [index: number];
    selectInventory: [index: number];
    renameInventory: [index: number];
  }>();
</script>

<template>
  <table class="w-full text-left rtl:text-right text-slate-500 dark:text-slate-400">
    <thead class="text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-400">
      <tr>
        <th scope="col" class="px-3 py-2">Name</th>
        <th scope="col" class="px-3 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(inventory, index) in inventories"
        :key="index"
        :class="{
          'hover:bg-slate-50 dark:hover:bg-slate-600': true,
          'border-b dark:border-slate-700': index < inventories.length - 1,
          'bg-white dark:bg-slate-800': index != selectedInventoryIndex,
          'bg-slate-50 dark:bg-slate-600': index == selectedInventoryIndex,
        }"
        @click.prevent="$emit('selectInventory', index)"
      >
        <td
          scope="row"
          @dblclick.prevent="$emit('renameInventory', index)"
          class="px-3 py-2 font-medium text-slate-900 whitespace-nowrap dark:text-white"
        >
          {{ inventory.name }}
        </td>
        <td scope="row" class="px-3 py-2">
          <div class="space-y-1 flex flex-col items-start">
            <button @click.prevent.stop="$emit('renameInventory', index)">Rename ✏️</button>
            <button @click.prevent.stop="$emit('deleteInventory', index)">Delete 🗑️</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
