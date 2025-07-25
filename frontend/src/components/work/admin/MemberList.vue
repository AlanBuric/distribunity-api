<script setup lang="ts">
  import type { OrganizationMember, Role, User } from '@/types';
  import RemovableChip from './RemovableChip.vue';

  defineEmits<{
    kickMember: [user: User];
    addRoleToMember: [roleId: string, memberId: string];
    removeRoleFromMember: [roleId: string, memberId: string];
  }>();
  const props = defineProps<{
    members: OrganizationMember[];
    roles: Role[];
  }>();

  function fetchUserData(memberIds: string[]) {
    return getDocs(query(collection(database, 'users'), where(documentId(), 'in', memberIds)));
  }

  function createUserMapping(querySnapshot: QuerySnapshot) {
    // Objects are faster than Maps lmao
    const map = {};

    querySnapshot.docs.forEach((doc) => (map[doc.id] = doc.data() as User & WithId));

    return map;
  }

  function createRoleMapping(roles: (Role & WithId)[]) {
    const map = {};

    roles.forEach((role) => (map[role.id] = role));

    return map;
  }

  const userMapping = createUserMapping(
    await fetchUserData(props.members.map((member) => member.id)),
  );
  const roleMapping = createRoleMapping(props.roles);
</script>

<template>
  <table class="w-full">
    <thead
      class="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-400"
    >
      <tr>
        <th scope="col" class="px-3 py-2">Name</th>
        <th scope="col" class="px-3 py-2">Roles</th>
        <th scope="col" class="px-3 py-2">Actions</th>
        <th scope="col" class="px-3 py-2">Joined</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="member in members"
        :key="member.id"
        :class="{ 'bg-white dark:bg-slate-800': true }"
      >
        <td
          scope="row"
          class="text-center px-3 py-2 font-medium text-slate-900 whitespace-nowrap dark:text-white"
        >
          {{ `${userMapping[member.id].firstName} ${userMapping[member.id].lastName}` }}
        </td>
        <td
          :class="{
            'text-center px-3 py-2 font-medium whitespace-nowrap': true,
            'text-slate-900 dark:text-white': member.roles.length,
            'text-slate-700 dark:text-slate-400': !member.roles.length,
          }"
        >
          <div v-if="member.roles.length" class="flex flex-wrap gap-2">
            <RemovableChip
              v-for="roleRef in member.roles"
              :key="getIdFromRefString(roleRef)"
              @click-action="$emit('removeRoleFromMember', getIdFromRefString(roleRef), member.id)"
            >
              {{ roleMapping[getIdFromRefString(roleRef)].name }}
            </RemovableChip>
          </div>
          <span v-else> None </span>
        </td>
        <td class="px-3 py-2 font-medium text-slate-900 whitespace-nowrap dark:text-white">
          <div class="flex flex-col items-center">
            <form
              @submit.prevent="
                (event) => $emit('addRoleToMember', event.target!['role-to-add'].value, member.id)
              "
              class="space-x-1"
            >
              <select
                name="role-to-add"
                id="role-to-add"
                class="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 shadow-sm focus:outline-none"
              >
                <option
                  v-for="role in roles"
                  :key="role.id"
                  :value="role.id"
                  :disabled="
                    !!member.roles.find((roleRef) => getIdFromRefString(roleRef) == role.id)
                  "
                >
                  {{ role.name }}
                </option>
              </select>
              <button
                type="submit"
                class="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 dark:hover:bg-teal-700 transition"
              >
                Add role
              </button>
            </form>
            <button
              v-if="member.id != auth.currentUser?.uid"
              @click="$emit('kickMember', userMapping[member.id])"
              class="px-2 py-1 font-normal bg-red-500 hover:bg-red-600 dark:hover:bg-red-700 text-white rounded"
            >
              Kick member
            </button>
          </div>
        </td>
        <td>
          {{ new Date(member.joined).toLocaleString() }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
