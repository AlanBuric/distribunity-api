<script setup lang="ts">
  import useAuthStore from '@/store/auth';
  import { availableLanguages } from '@/store/global';
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
  <main class="max-w-screen-2xl self-center items-center flex flex-col py-6 px-8 styled-box">
    <h1 class="text-2xl font-light mb-6 text-black dark:text-white">User Settings</h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <section>
        <h2 class="text-xl font-light mb-4 text-black dark:text-slate-200">Profile Settings</h2>

        <form @submit.prevent="saveProfileSettings">
          <div class="mb-4">
            <label class="block mb-2 text-black dark:text-slate-200">First name</label>
            <input type="text" v-model="firstName" class="styled-input" />
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-black dark:text-slate-200">Last name</label>
            <input type="text" v-model="lastName" class="styled-input" />
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-black dark:text-slate-200">Language</label>
            <select v-model="language" class="styled-input">
              <option v-for="language in availableLanguages" :value="language[0]">
                {{ language[1] }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-black dark:text-slate-200">Theme</label>
            <select v-model="theme" class="styled-input">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <button type="submit" class="button-primary">Save Profile</button>
        </form>
      </section>

      <div class="grow border-r border-r-slate-500" />

      <section>
        <h2 class="text-xl font-light mb-4 text-black dark:text-white">Account Settings</h2>

        <form @submit.prevent="changeEmail">
          <div class="mb-4">
            <label class="block mb-2 text-black dark:text-slate-200">Change email</label>
            <input type="email" v-model="newEmail" class="styled-input" />
          </div>

          <div class="flex gap-4">
            <button type="button" @click="changeEmail" class="button-primary">Change Email</button>

            <button type="button" @click.prevent.stop="changePassword" class="button-primary">
              Reset Password
            </button>
          </div>
        </form>
      </section>

      <div class="grow border-r border-r-slate-500" />

      <section>
        <h2 class="text-xl font-light mb-4 text-black dark:text-white">Account deletion</h2>

        <form @submit.prevent="deleteAccount">
          <div class="mb-4">
            <label class="block mb-2 text-black dark:text-slate-200" for="confirm-email"
              >Confirm email</label
            >
            <input
              type="email"
              name="confirm-email"
              id="confirm-email"
              v-model="emailConfirmation"
              class="styled-input"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-black dark:text-slate-200" for="confirm-password"
              >Confirm password</label
            >
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              v-model="passwordConfirmation"
              class="styled-input"
            />
          </div>

          <button type="submit" class="button-primary">Delete Account</button>
        </form>
      </section>
    </div>
  </main>
</template>
