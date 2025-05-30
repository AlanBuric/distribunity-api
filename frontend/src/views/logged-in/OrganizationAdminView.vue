<script setup lang="ts">
  import { database } from '@/firebase/init';
  import { ALL_PERMISSIONS, type CountryData, type MemberVuefire, type Organization, type RestCountriesCountry, type Role, type User, type WithId } from '@/types';
  import { doc, updateDoc, arrayRemove, arrayUnion, collection, addDoc, writeBatch } from 'firebase/firestore';
  import { useRoute } from 'vue-router';
  import { useDocument, useCollection } from 'vuefire';
  import { ref } from 'vue';
  import MemberList from '@/components/admin/MemberList.vue';
  import { deleteOrganization } from '@/scripts/firebase-utilities';
  import RemovableChip from '@/components/admin/RemovableChip.vue';
  import useAuthStore from '@/store/auth';
  import { NO_PERMISSIONS_MESSAGE } from '@/scripts/shared';
  import { filterCountriesByName } from '@/scripts/country-search';

  const authStore = useAuthStore();

  const organizationId = useRoute().params.id as string;
  const organizationDocRef = doc(database, 'organizations', organizationId);
  const membersCollRef = collection(organizationDocRef, 'members');
  const rolesCollRef = collection(organizationDocRef, 'roles');

  const organization = useDocument<Organization>(organizationDocRef, { maxRefDepth: 0 });
  const members = useCollection<MemberVuefire>(membersCollRef, { maxRefDepth: 0 });
  const roles = useCollection<Role>(rolesCollRef);

  const newRoleName = ref('');
  const newInviteCode = ref('');

  await organization.promise.value;

  const newName = ref(organization.value?.name);
  const countrySearchInput = ref<string>(organization.value!.country);
  const countryResults = ref<RestCountriesCountry[]>([]);
  const selectedCountry = ref<CountryData | undefined>({
    country: organization.value!.country,
    countryCode: organization.value!.countryCode,
  });

  const organizationEditFeedback = ref<{ feedback: string, success: boolean }>();

  async function saveOrganizationSettings() {
    if (!authStore.hasPermission('organization.edit')) {
      alert(NO_PERMISSIONS_MESSAGE);
    } else if (!selectedCountry.value) {
      organizationEditFeedback.value = {
        feedback: 'Please select a country.',
        success: false,
      };
    } else {
      await updateDoc(organizationDocRef, { ...selectedCountry.value, name: newName.value ?? organization.value?.name ?? 'Unknown organization' });

      organizationEditFeedback.value = {
        feedback: 'Organization settings have been changed.',
        success: true,
      };
    }
  }

  async function searchCountries() {
    countryResults.value = await filterCountriesByName(countrySearchInput.value);
    // Reset the current input to empty string so that it defaults to the default disabled value.
    selectedCountry.value = undefined;
  };

  function removeMember(user: User & WithId) {
    if (!authStore.hasPermission('organization.invites.create')) {
      alert(NO_PERMISSIONS_MESSAGE);
    } else if (confirm(`Are you sure you want to kick ${user.firstName} ${user.lastName} from your organization?`)) {
      const batch = writeBatch(database);

      batch.delete(doc(membersCollRef, user.id));
      batch.update(doc(database, 'users', user.id), { organizations: arrayRemove(organizationDocRef) });

      batch.commit();
    }
  }

  function createInviteCode() {
    if (!authStore.hasPermission('organization.invites.create')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    } else if (newInviteCode.value.length < 6) {
      alert('Your invite code should be at least 6 characters long');
      return;
    }

    updateDoc(organizationDocRef, {
      invites: arrayUnion(newInviteCode.value),
    });

    newInviteCode.value = '';
  }

  function removeInviteCode(inviteCode: string) {
    if (!authStore.hasPermission('organization.invites.delete')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    }

    updateDoc(organizationDocRef, {
      invites: arrayRemove(inviteCode),
    });
  }

  function createRole() {
    if (!authStore.hasPermission('organization.roles.create')) {
      alert(NO_PERMISSIONS_MESSAGE);
    } else if (newRoleName.value) {
      addDoc(rolesCollRef, {
        name: newRoleName.value,
        permissions: [],
      });

      newRoleName.value = '';
    }
  }

  function deleteRole(roleId: string) {
    if (!authStore.hasPermission('organization.roles.delete')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    } else if (confirm(`Are you sure you want to delete this role?`)) {
      const batch = writeBatch(database);

      batch.delete(doc(rolesCollRef, roleId));
      members.value.forEach((member) => {
        batch.update(doc(membersCollRef, member.id), { roles: arrayRemove(roleId) });
      });

      batch.commit();
    }
  }

  function addPermission(roleId: string, permission: string) {
    if (!authStore.hasPermission('organization.roles.updatePermissions')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    }

    updateDoc(doc(rolesCollRef, roleId), { permissions: arrayUnion(permission) });
  }

  function removePermission(roleId: string, permission: string) {
    if (!authStore.hasPermission('organization.roles.updatePermissions')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    }

    updateDoc(doc(rolesCollRef, roleId), { permissions: arrayRemove(permission) });
  }

  function addRoleToMember(roleId: string, memberId: string) {
    if (!authStore.hasPermission('organization.members.updateRoles')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    }

    updateDoc(doc(membersCollRef, memberId), { roles: arrayUnion(doc(rolesCollRef, roleId)) });
  }

  function removeRoleFromMember(roleId: string, memberId: string) {
    if (!authStore.hasPermission('organization.members.updateRoles')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    }

    updateDoc(doc(membersCollRef, memberId), { roles: arrayRemove(doc(rolesCollRef, roleId)) });
  }

  function deleteOrganizationWithValidation() {
    if (!authStore.hasPermission('organization.delete')) {
      alert(NO_PERMISSIONS_MESSAGE);
      return;
    }

    deleteOrganization(organization.value!);
  }
</script>

<template>
  <main v-if="organization" class="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex justify-center">
    <div class="max-w-5xl flex-grow flex flex-col items-center py-6 space-y-6">
      <h1 class="text-3xl font-semibold text-center">
        Organization: {{ organization.name }}
      </h1>

      <section class="w-full bg-white dark:bg-gray-800 shadow rounded-lg px-5 py-4">
        <h2 class="text-2xl font-semibold mb-4">
          Organization Information
        </h2>

        <form @submit.prevent="saveOrganizationSettings" class="flex flex-col space-y-4">
          <div class="flex flex-col space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Organization name
              </label>
              <input
                id="name"
                v-model="newName"
                name="name"
                type="text"
                minlength="3"
                required
                placeholder="My Awesome Business"
                class="mt-1 block w-full rounded-md px-3 py-2 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Country
              </label>
              <div class="flex flex-row space-x-2 mt-1">
                <input
                  v-model="countrySearchInput"
                  name="country-search"
                  placeholder="Search..."
                  type="search"
                  minlength="3"
                  class="w-full rounded-md px-3 py-2 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
                >
                <button
                  type="button"
                  for="country-search"
                  @click.prevent.stop="searchCountries"
                  class="bg-teal-500 text-sm text-white rounded-md px-4 py-2 shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-teal-400 dark:hover:bg-teal-500"
                >
                  Search
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Select your country from the list of results below.
              </p>

              <select
                v-model="selectedCountry"
                name="country"
                id="country"
                class="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
                required
              >
                <option
                  disabled v-if="countryResults.length === 0"
                  :value="{ countryCode: organization.countryCode, country: organization.country }"
                >
                  {{ organization.country }}
                </option>
                <template v-else>
                  <option disabled :value="undefined">
                    Please select a country
                  </option>
                  <option v-for="country in countryResults" :key="country.cca3" :value="{ countryCode: country.cca3, country: country.name.common }">
                    {{ country.name.common }}
                  </option>
                </template>
              </select>
            </div>
          </div>

          <button type="submit" class="flex-initial px-3 py-2 bg-teal-500 text-white rounded" @click="saveOrganizationSettings">
            Save settings
          </button>
        </form>
      </section>

      <section class="w-full bg-white dark:bg-gray-800 shadow rounded-lg px-5 py-4">
        <h2 class="text-2xl font-semibold mb-4">
          Manage members
        </h2>
        <MemberList
          v-if="members.length"
          class="w-full"
          :members="members"
          :roles="roles"
          @remove-member="removeMember"
          @add-role-to-member="addRoleToMember"
          @remove-role-from-member="removeRoleFromMember"
        />
      </section>

      <section class="w-full bg-white dark:bg-gray-800 shadow rounded-lg px-5 py-4 space-y-3">
        <h2 class="text-2xl font-semibold mb-4">
          Invite codes
        </h2>
        <form @submit.prevent="createInviteCode" class="flex space-x-4">
          <input
            v-model="newInviteCode" minlength="6" placeholder="Enter new invite code"
            class="flex-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 appearance-none dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-active-link"
          >
          <button type="submit" class="px-3 py-2 bg-teal-500 text-white rounded">
            Create invite code
          </button>
        </form>
        <ul v-if="organization.invites.length < 20">
          <li v-for="(invite, index) in organization.invites" :key="index" class="flex justify-between items-center mb-2">
            <span>{{ invite }}</span>
            <button @click="removeInviteCode(invite)" class="px-3 py-1 bg-red-500 text-white rounded">
              Remove
            </button>
          </li>
        </ul>
        <p v-else>
          <span v-for="(invite, index) in organization.invites" :key="index">
            {{ invite }} <button class="text-red-500" @click.prevent="removeInviteCode(invite)">×</button>{{ index != organization.invites.length - 1 ? ', ' : '' }}
          </span>
        </p>
      </section>

      <section class="w-full bg-white dark:bg-gray-800 shadow rounded-lg px-5 py-4">
        <h2 class="text-2xl font-semibold mb-4">
          Manage roles
        </h2>
        <form @submit.prevent="createRole" class="flex space-x-4 mb-4">
          <input v-model="newRoleName" placeholder="Enter new role name" class="flex-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 appearance-none dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-active-link">
          <button type="submit" class="px-3 py-2 bg-teal-500 text-white rounded">
            Create role
          </button>
        </form>
        <table class="w-full">
          <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-3 py-2">
                Name
              </th>
              <th scope="col" class="px-3 py-2">
                Add permission
              </th>
              <th scope="col" class="px-3 py-2">
                Permissions
              </th>
              <th scope="col" class="px-3 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id" class="bg-white dark:bg-gray-800 transition-all">
              <td class="px-3 py-2">
                {{ role.name }}
              </td>
              <td class="px-3 py-2">
                <form @submit.prevent="event => addPermission(role.id, event.target!['permission-to-add'].value)" class="space-x-1 space-y-1">
                  <select name="permission-to-add" id="permission-to-add" class="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:outline-none">
                    <option v-for="permission in ALL_PERMISSIONS" :key="permission" :disabled="role.permissions.includes(permission)">
                      {{ permission }}
                    </option>
                  </select>
                  <button type="submit" class="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 dark:hover:bg-teal-700 transition">
                    Add permission
                  </button>
                </form>
              </td>
              <td class="px-3 py-2">
                <div class="flex flex-wrap gap-2">
                  <RemovableChip v-for="permission in role.permissions" :key="permission" @click-action="removePermission(role.id, permission)">
                    {{ permission }}
                  </RemovableChip>
                </div>
              </td>
              <td class="px-3 py-2">
                <button @click.prevent="deleteRole(role.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="w-full bg-white dark:bg-gray-800 shadow rounded-lg px-5 py-4">
        <h2 class="text-2xl font-semibold mb-1">
          Delete organization
        </h2>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">
          This action is irreversible.
        </p>

        <button @click.prevent="deleteOrganizationWithValidation" class="mb-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:hover:bg-red-800 transition">
          Delete organization
        </button>
      </section>
    </div>
  </main>
</template>
