<script lang="ts" setup>
  import type { Item, Inventory } from '@/types';
  import { ref } from 'vue';

  const emit = defineEmits<{ closeForm: [] }>();
  const props = defineProps<{
    selectedItem: Item & WithId;
    selectedInventory: Inventory;
    organizationId: string;
  }>();

  const formAction = ref<string>();

  const name = ref<string>(props.selectedItem.name);
  const quantity = ref<number>(props.selectedItem.quantity);
  const unit = ref<string>(props.selectedItem.unit);
  const unitPrice = ref<number>(props.selectedItem.unitPrice);
  const iconURL = ref<string>(props.selectedItem.iconURL);
  const numericAttributes = ref<Record<string, number>[]>(
    extractNumericAttributes(props.selectedItem.attributes),
  );
  const stringAttributes = ref<Array<Record<string, string>>>(
    extractStringAttributes(props.selectedItem.attributes),
  );
  const tagAttributes = ref<Array<string>>(extractTags(props.selectedItem.attributes));

  function extractNumericAttributes(attributes: any[]): Record<string, number>[] {
    return attributes.filter(
      (attr) =>
        typeof attr === 'object' && Object.values(attr).every((value) => typeof value === 'number'),
    ) as any;
  }

  function extractStringAttributes(attributes: any[]): Record<string, string>[] {
    return attributes.filter(
      (attr) =>
        typeof attr === 'object' && Object.values(attr).every((value) => typeof value === 'string'),
    ) as any;
  }

  function extractTags(attributes: any[]): string[] {
    return attributes.filter((attr) => typeof attr === 'string');
  }

  function submitItemSave() {
    if (formAction.value == 'save') {
      const updatedItem: Item = {
        name: name.value,
        quantity: quantity.value,
        unit: unit.value,
        unitPrice: unitPrice.value,
        attributes: numericAttributes.value
          .concat(stringAttributes.value as any)
          .concat(tagAttributes.value as any),
        iconURL: iconURL.value,
      };

      updateDoc(
        doc(
          database,
          'organizations',
          props.organizationId,
          'inventories',
          props.selectedInventory.id,
          'items',
          props.selectedItem.id,
        ),
        updatedItem,
      ).finally(() => emit('closeForm'));
    } else {
      emit('closeForm');
    }

    formAction.value = undefined;
  }
</script>

<template>
  <aside class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4 flex flex-col">
    <h1 class="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-200">
      Item editor > {{ name }}
    </h1>

    <img v-if="iconURL" :src="iconURL" class="max-w-48 shadow-md border-slate-300 rounded-md" />

    <form @submit.prevent="submitItemSave" class="flex flex-col space-y-4">
      <div class="flex flex-col">
        <label for="name" class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Item Name</label
        >
        <input
          type="text"
          id="name"
          placeholder="New item..."
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
          placeholder="pieces..."
          v-model="unit"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
        />
      </div>

      <div class="flex flex-col">
        <label for="unit-price" class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Unit Price</label
        >
        <input
          type="number"
          id="unit-price"
          min="0"
          step="0.01"
          v-model="unitPrice"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
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
          v-model="quantity"
          class="mt-1 p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
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
          Save to {{ selectedInventory.name }}
        </button>
        <button
          @click="formAction = 'close'"
          class="px-4 py-2 font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-md shadow-sm hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600 focus:outline-none"
        >
          Discard changes
        </button>
      </div>
    </form>
  </aside>
</template>
