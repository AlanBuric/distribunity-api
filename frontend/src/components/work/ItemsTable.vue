<script lang="ts" setup>
  import { useQuery } from '@/composables/query';
  import { type InventoryItem, type Item } from '@/types';
  import LoadingAnimation from '@/components/icons/LoadingAnimation.vue';

  defineEmits<{
    editItem: [item: Item];
    deleteItem: [item: Item];
    selectItem: [item: Item];
    createNewItem: [];
  }>();

  const props = defineProps<{
    organizationId: number;
    selectedInventoryId: number;
    selectedItemId: number | undefined;
  }>();

  const {
    data: items,
    queryError,
    isLoading,
  } = useQuery<InventoryItem[]>(
    `/api/organizations/${props.organizationId}/inventories/${props.selectedInventoryId}`,
  );
</script>

<template>
  <table class="w-full table-fixed text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th class="cursor-pointer px-3 py-2" scope="col">Icon</th>
        <th class="cursor-pointer px-3 py-2" scope="col">Name</th>
        <th class="cursor-pointer px-3 py-2" scope="col">Quantity</th>
        <th class="cursor-pointer px-3 py-2" scope="col">Unit price</th>
        <th class="cursor-pointer px-3 py-2" scope="col">Total price</th>
        <th class="cursor-pointer px-3 py-2" scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="queryError">
        <td colspan="6" class="px-3 py-2 bg-white dark:bg-gray-800 text-center">
          An error occurred while trying to display data.
        </td>
      </tr>
      <tr v-else-if="isLoading">
        <td colspan="6" class="px-3 py-2 bg-white dark:bg-gray-800 text-center">
          <LoadingAnimation />
        </td>
      </tr>
      <template v-else-if="items?.length">
        <tr
          v-for="(item, index) in items"
          :key="item.itemId"
          @click="$emit('selectItem', item)"
          :class="{
            'hover:bg-gray-50 dark:hover:bg-gray-600': true,
            'border-b dark:border-gray-700': index < items.length - 1,
            'bg-white dark:bg-gray-800': item.itemId != props.selectedItemId,
            'bg-gray-50 dark:bg-gray-600': item.itemId == selectedItemId,
          }"
        >
          <td class="px-3 py-2">
            <img
              v-if="item.iconUrl"
              :src="item.iconUrl"
              class="max-w-[60%] shadow-md border-gray-300 rounded-md"
            />
          </td>
          <td class="px-3 py-2">{{ item.name }}</td>
          <td class="px-3 py-2">{{ item.quantity }}</td>
          <td class="px-3 py-2">{{ item.unitPrice }}</td>
          <td class="px-3 py-2">{{ item.unitPrice * item.quantity }}</td>
          <td class="px-3 py-2">
            <div class="space-y-1 flex flex-col items-start">
              <button @click.prevent.stop="$emit('editItem', item)">Edit ✏️</button>
              <button @click.prevent.stop="$emit('deleteItem', item)">Delete🗑️</button>
            </div>
          </td>
        </tr>
      </template>
      <tr v-else>
        <td colspan="6" class="px-3 py-2 bg-white dark:bg-gray-800 text-center">
          Your inventory is empty.
          <button class="underline" @click.prevent="$emit('createNewItem')">
            Consider adding some items.
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
