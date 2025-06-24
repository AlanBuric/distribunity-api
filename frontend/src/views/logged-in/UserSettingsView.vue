<script setup lang="ts">
  import useAuthStore from '@/store/auth';
  import axios from 'axios';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  const newEmail = ref(authStore.user.email);

  const firstName = ref(authStore.user.firstName);
  const lastName = ref(authStore.user.lastName);
  const language = ref(authStore.user.language);
  const theme = ref(authStore.user.theme);

  const emailConfirmation = ref('');
  const passwordConfirmation = ref('');

  function saveProfileSettings() {
    axios
      .patch('/api/users/self', {
        firstName: firstName.value,
        lastName: lastName.value,
        language: language.value,
        theme: theme.value,
        email: newEmail.value,
      })
      .then(() => alert('Your settings have been updated.'))
      .catch(() => alert("Sorry, we couldn't update your settings."));
  }

  function changePassword() {
    axios.patch('/api/users/self/password', {});
  }

  async function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const userId = authStore.user.userId;

      try {
        await axios.delete('/api/users/self');
        await authStore.signOut();

        router.push({ path: '/signup' });
      } catch (error: any) {
        alert(error['message'] ?? error);
      }
    }
  }
</script>

<template>
  <main
    class="flex-1 items-center flex flex-col p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
  >
    <h1 class="text-3xl font-semibold mb-4">User Settings</h1>

    <div class="flex flex-col lg:flex-row space-x-10">
      <div class="h-full bg-slate-500 w-[1px]" />

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>

        <form @submit.prevent="saveProfileSettings">
          <div class="mb-4">
            <label class="block mb-2">First name</label>
            <input
              type="text"
              v-model="firstName"
              class="px-3 py-2 border border-slate-500 rounded w-56 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-2">Last name</label>
            <input
              type="text"
              v-model="lastName"
              class="px-3 py-2 border border-slate-500 rounded w-56 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-2">Profile photo link</label>
            <input
              type="url"
              v-model="profilePhotoURL"
              class="px-3 py-2 border border-slate-500 rounded w-56 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-2">Language</label>
            <select
              v-model="language"
              class="px-3 py-2 border border-slate-500 rounded w-56 dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="en-US">English</option>
              <option value="hr-HR">Croatian</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2">Theme</label>
            <select
              v-model="theme"
              class="px-3 py-2 border border-slate-500 rounded w-56 dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <button
            type="submit"
            class="px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Save Profile
          </button>
        </form>
      </section>

      <div class="h-full bg-slate-500 w-[1px]" />

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Account Settings</h2>

        <form @submit.prevent="changeEmail">
          <div class="mb-4">
            <label class="block mb-2">Change email</label>
            <input
              type="email"
              v-model="newEmail"
              class="px-3 py-2 border border-slate-500 rounded w-64 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div class="flex gap-4">
            <button
              type="button"
              @click="changeEmail"
              class="px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              Change Email
            </button>

            <button
              type="button"
              @click.prevent.stop="changePassword"
              class="px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700"
            >
              Reset Password
            </button>
          </div>
        </form>
      </section>

      <div class="h-full bg-slate-500 w-[1px]" />

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Account deletion</h2>

        <form @submit.prevent="deleteAccount">
          <div class="mb-4">
            <label class="block mb-2" for="confirm-email">Confirm email</label>
            <input
              type="email"
              name="confirm-email"
              id="confirm-email"
              v-model="emailConfirmation"
              class="px-3 py-2 border border-slate-500 rounded w-64 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-2" for="confirm-password">Confirm password</label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              v-model="passwordConfirmation"
              class="px-3 py-2 border border-slate-500 rounded w-64 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <button
            type="submit"
            class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Delete Account
          </button>
        </form>
      </section>

      <div class="h-full bg-slate-500 w-[1px]" />
    </div>
  </main>
</template>
