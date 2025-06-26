import {
  type AdaptedSelfOrganization,
  AuthState,
  LocalStorage,
  type OrganizationSelfResponse,
  type PermissionId,
  type User,
} from '@/types';
import axios, { type AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import useGlobalStore from './global';

const EMPTY_USER: User = {
  userId: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  firstName: '',
  lastName: '',
  theme: 'light',
  email: '',
  language: 'en-US',
};

function setAccessToken(accessToken: string) {
  localStorage.setItem(LocalStorage.ACCESS_TOKEN, accessToken);
  axios.defaults.headers.authorization = `Bearer ${accessToken}`;
}

axios.interceptors.response.use((response) => {
  const newBearerAccessToken: string = response.headers.authorization;

  if (newBearerAccessToken) setAccessToken(newBearerAccessToken.split(' ', 2)[1]);

  return response;
});

const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>(AuthState.Loading);
  const user = ref<User>(EMPTY_USER);
  const currentOrganization = ref<AdaptedSelfOrganization>();

  let resolveReady: (() => void) | null = null;

  const authReady = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  /**
   * First time login with credentials.
   */
  async function logIn(email: string, password: string) {
    return axios.post<User>('/api/login', { email, password }).then(({ data }) => {
      user.value = data;
      state.value = AuthState.LoggedIn;
    });
  }

  /**
   * When the access token is already present, i.e. the user has logged in
   * but they've refreshed the page or came back a few days later.
   */
  async function tryLogIn() {
    const accessToken = localStorage.getItem(LocalStorage.ACCESS_TOKEN);

    if (!accessToken) {
      state.value = AuthState.LoggedOut;

      resolveReady?.();
      return;
    }

    axios.defaults.headers.authorization = `Bearer ${accessToken}`;

    await axios
      .get<User>(`/api/users/self`)
      .then(({ data }) => {
        user.value = data;
        state.value = AuthState.LoggedIn;
      })
      .catch((error: AxiosError) => {
        state.value = AuthState.LoggedOut;

        if (error.status && error.status >= 300 && error.status < 500) {
          localStorage.removeItem(LocalStorage.ACCESS_TOKEN);
        }
      });

    useGlobalStore().loadPreferredTheme();
    useGlobalStore().loadPreferredLanguage();

    resolveReady?.();
  }

  async function signOut() {
    await axios.delete('/api/logout').catch();

    delete axios.defaults.headers.authorization;

    localStorage.removeItem(LocalStorage.ACCESS_TOKEN);

    state.value = AuthState.LoggedOut;
    user.value = EMPTY_USER;
  }

  async function loadOrganization(organizationId: string) {
    if (currentOrganization.value?.organizationId.toString() != organizationId) {
      currentOrganization.value = await axios
        .get<OrganizationSelfResponse>(`/api/organizations/${organizationId}`)
        .then(({ data }) => {
          // @ts-ignore
          data.permissions = new Set(data.permissions);
          return data as AdaptedSelfOrganization;
        });
    }
  }

  function isOrganizationOwner() {
    return (
      state.value == AuthState.LoggedIn && currentOrganization.value?.ownerId == user.value?.userId
    );
  }

  function hasPermission(permission: PermissionId) {
    return isOrganizationOwner() || currentOrganization.value?.permissions.has(permission);
  }

  tryLogIn();

  return {
    state,
    user,
    authReady,
    currentOrganization,
    signOut,
    logIn,
    tryLogIn,
    loadOrganization,
    isOrganizationOwner,
    hasPermission,
  };
});

export default useAuthStore;
