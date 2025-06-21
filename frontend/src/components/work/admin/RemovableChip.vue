<script setup lang="ts">
  defineEmits<{ clickAction: [] }>();
</script>

<template>
  <div class="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded flex items-center">
    <slot />
    <button @click.prevent="$emit('clickAction')" class="ml-2 text-red-500 hover:text-red-700">
      &times;
    </button>
  </div>
</template>
