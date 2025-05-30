<script lang="ts" setup> import { database } from '@/firebase/init';
  import { getItemColumnValue } from '@/scripts/items';
  import { getPrettyEnumName } from '@/scripts/shared';
  import { ColumnType, type Item, type WithId } from '@/types';
  import { collection } from 'firebase/firestore';
  import { computed } from 'vue';
  import { useCollection } from 'vuefire';

  defineEmits<{ editItem: [item: Item & WithId], deleteItem: [item: Item & WithId], selectItem: [item: Item & WithId], createNewItem: [] }>();
  const props = defineProps<{
    organizationId: string
    selectedInventoryId: string
    selectedItemId: string | undefined
  }>();
  const columns = [ColumnType.ICON_URL, ColumnType.NAME, ColumnType.UNIT, ColumnType.QUANTITY, ColumnType.UNIT_PRICE, ColumnType.TOTAL_PRICE].map(enumName => ({
    enumName: enumName,
    name: getPrettyEnumName(enumName),
  }));

  const selectedItemsCollectionRef = computed(() => collection(database, 'organizations', props.organizationId, 'inventories', props.selectedInventoryId, 'items'));
  const items = useCollection<Item>(selectedItemsCollectionRef);
</script>

<template>
  <table class="w-full table-fixed text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th
          v-for="(columnName, index) in columns" :key="index" class="cursor-pointer px-3 py-2"
          scope="col"
        >
          {{ columnName.name }}
        </th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="items.length > 0">
        <tr
          v-for="(item, index) in items" :key="item.id"
          @click="$emit('selectItem', item)"
          :class="{
            'hover:bg-gray-50 dark:hover:bg-gray-600': true, 'border-b dark:border-gray-700': index < items.length - 1,
            'bg-white dark:bg-gray-800': item.id != selectedItemId,
            'bg-gray-50 dark:bg-gray-600': item.id == selectedItemId
          }"
        >
          <td v-for="column in columns" :key="column.enumName" class="px-3 py-2">
            <img v-if="column.enumName == ColumnType.ICON_URL" :src="getItemColumnValue(item, column.enumName)" class="max-w-[60%] shadow-md border-gray-300 rounded-md">
            <span v-else>{{ getItemColumnValue(item, column.enumName) }}</span>
          </td>
          <td class="px-3 py-2">
            <div class="space-y-1 flex flex-col items-start">
              <button @click.prevent.stop="$emit('editItem', item)">
                Edit ✏️
              </button>
              <button @click.prevent.stop="$emit('deleteItem', item)">
                Delete🗑️
              </button>
            </div>
          </td>
        </tr>
      </template>
      <tr v-else>
        <td colspan="6" class="px-3 py-2 bg-white dark:bg-gray-800 text-center">
          Your inventory is empty.
          <button class="underline" @click.prevent="$emit('createNewItem')">
            Consider adding some items
          </button>.
        </td>
      </tr>
    </tbody>
  </table>
</template>
