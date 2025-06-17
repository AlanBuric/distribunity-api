import { AuthState, type AuthUser, type OrganizationInfo, Permission } from '@/types';
import type { User } from '@backend-types/database-types';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser>({ authState: AuthState.Loading });
  const currentOrganization = ref<OrganizationInfo>();

  async function tryLogIn(userId: string) {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      user.value = { authState: AuthState.LoggedOut };
      return;
    }

    axios.defaults.headers.authorization = `Bearer ${accessToken}`;

    user.value = await axios
      .get<User>(`/api/users/${userId}`)
      .then(({ data }) => Object.assign(data, { authState: AuthState.LoggedIn }))
      .catch(() => ({ authState: AuthState.LoggedOut }));
  }

  async function loadOrganization(organizationId: number) {
    if (currentOrganization.value?.organizationId != organizationId) {
      currentOrganization.value = await axios
        .get(`/api/organizations/${organizationId}`)
        .then(({ data }) => data);
    }
  }

  function isOrganizationOwner() {
    return (
      user.value?.authState == AuthState.LoggedIn &&
      currentOrganization.value?.ownerId == user.value?.userId
    );
  }

  function hasPermission(permission: Permission) {
    return isOrganizationOwner() || currentOrganization.value?.permissions.has(permission);
  }

  return {
    user,
    currentOrganization,
    tryLogUserIn: tryLogIn,
    loadOrganizationData: loadOrganization,
    isOrganizationOwner,
    hasPermission,
  };
});

export default useAuthStore;
