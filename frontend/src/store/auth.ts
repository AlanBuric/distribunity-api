import { AuthState, type AuthUser, type Organization, type Permission, type User } from '@/types';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser>({ authState: AuthState.Loading });
  const currentOrganization = ref<Organization>();

  async function tryLogUserIn(userId: string) {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      axios.defaults.headers.authorization = accessToken;
      user.value = await axios.get(`/api/user${userId}`).then(({ data }) => data);
    }
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
    return (
      isOrganizationOwner() ||
      currentOrganizationRoles.value.some((role) => role.permissions.includes(permission))
    );
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
