<script lang="ts" setup>
  import type { Item, Inventory } from '@/types';
  import { ref } from 'vue';

  const emit = defineEmits<{ closeForm }>();
  const props = defineProps<{ selectedInventory: Inventory; organizationId: string }>();

  const formAction = ref<string>();

  const name = ref<string>('');
  const quantity = ref<number>(0);
  const unit = ref<string>('');
  const unitPrice = ref<number>(1);
  const iconURL = ref<string>('');
  const numericAttributes = ref<Record<string, number>[]>([]);
  const stringAttributes = ref<Array<Record<string, string>>>([]);
  const tagAttributes = ref<Array<string>>([]);

  function submitItemCreation() {
    if (formAction.value == 'save') {
      if (!name.value || quantity.value < 0 || unitPrice.value < 0) {
        alert('Please provide valid details for the item.');
        return;
      }

      const newItem: Item = {
        name: name.value,
        quantity: quantity.value,
        unit: unit.value,
        unitPrice: unitPrice.value,
        attributes: numericAttributes.value
          .concat(stringAttributes.value as any)
          .concat(tagAttributes.value as any),
        iconURL: iconURL.value,
      };

      addDoc(
        collection(
          database,
          'organizations',
          props.organizationId,
          'inventories',
          props.selectedInventory.inventoryId,
          'items',
        ),
        newItem,
      )
        .catch(console.error)
        .finally(() => emit('closeForm'));
    } else {
      emit('closeForm');
    }

    formAction.value = undefined;
  }
</script>

<template>
  <aside class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4 flex flex-col">
    <h1 class="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-200">
      Create a new item > {{ name }}
    </h1>

    <img v-if="iconURL" :src="iconURL" class="w-48 shadow-md border-slate-300 rounded-md" />

    <form @submit.prevent="submitItemCreation" class="flex flex-col space-y-4">
      <div class="flex flex-col">
        <label for="name" class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Item name</label
        >
        <input
          type="text"
          id="name"
          placeholder="New item name"
          v-model="name"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
        />
      </div>

      <div class="flex flex-col">
        <label for="unit" class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Unit</label
        >
        <input
          type="text"
          id="unit"
          placeholder="pieces, ml, kg, lbs..."
          v-model="unit"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
        />
      </div>

      <div class="flex flex-col">
        <label for="unit-price" class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Unit price</label
        >
        <input
          type="number"
          id="unit-price"
          min="0"
          step="0.01"
          v-model="unitPrice"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
          required
        />
      </div>

      <div class="flex flex-col">
        <label for="quantity" class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Quantity</label
        >
        <input
          type="number"
          id="quantity"
          min="0"
          value="0"
          v-model="quantity"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
          required
        />
      </div>

      <div class="flex flex-col">
        <label for="photo-url" class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Photo link</label
        >
        <input
          type="url"
          id="photo-url"
          v-model="iconURL"
          placeholder="e.g. https://i.imgur.com/jeBUkmj.png"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
        />
      </div>

      <div class="flex space-x-3">
        <button
          type="submit"
          @click="formAction = 'save'"
          class="px-4 py-2 font-medium text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Save to {{ props.selectedInventory.name }}
        </button>
        <button
          @click="formAction = 'close'"
          class="px-4 py-2 font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-md shadow-sm hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600 focus:outline-none"
        >
          Discard
        </button>
      </div>
    </form>
  </aside>
</template>
