import { AuthState, type AuthUser, type OrganizationInfo, Permission } from '@/types';
import type { UserLoginResponse } from '@backend-types/data-transfer-objects';
import type { User } from '@backend-types/database-types';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser>({ authState: AuthState.Loading });
  const currentOrganization = ref<OrganizationInfo>();

  async function tryLogUserIn(userId: string) {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      axios.defaults.headers.authorization = accessToken;

      try {
        user.value = await axios
          .get<User>(`/api/user/${userId}`)
          .then(({ data }) => Object.assign(data, { authState: AuthState.LoggedIn }));

        return;
      } catch (ignored) {}
    }

    user.value = await axios.post<UserLoginResponse>(`/api/refresh`).then(({ data }) => {
      axios.defaults.headers.authorization = data.accessToken;
      localStorage.setItem('accessToken', data.accessToken);

      return Object.assign(data.user, { authState: AuthState.LoggedIn });
    });
  }

  async function loadOrganizationData(organizationId: number) {
    if (currentOrganization.value?.organizationId != organizationId) {
      currentOrganization.value = await axios
        .get(`/api/organization/${organizationId}`)
        .then(({ data }) => data);
    }
  }

  function isOrganizationOwner() {
    return (
      user.value.authState == AuthState.LoggedIn &&
      currentOrganization.value &&
      currentOrganization.value.ownerId == user.value.userId
    );
  }

  function hasPermission(permission: Permission) {
    return isOrganizationOwner() || currentOrganization.value?.permissions.has(permission);
  }

  return {
    user,
    currentOrganization,
    tryLogUserIn,
    loadOrganizationData,
    isOrganizationOwner,
    hasPermission,
  };
});

export default useAuthStore;
