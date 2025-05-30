import { createRouter, createWebHistory } from 'vue-router';
import 'vue-router';
import useAuthStore from './store/auth';
import { getIdFromRefString } from './scripts/firebase-utilities';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    requiresOrganizationAdmin?: boolean;
    avoidIfAuthed?: RouteLocationRaw;
    shouldLoadMember?: boolean;
  }
}

const DEFAULT_TITLE = 'Distribunity';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: ['/home'],
      name: 'home-view',
      component: () => import('@/pages/HomePage.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/home/HomeView.vue'),
        },
        {
          path: 'resources',
          alias: ['help', 'support', 'about'],
          name: 'resources-view',
          component: () => import('@/views/home/ResourcesView.vue'),
          children: [
            {
              path: '',
              name: 'resources',
              component: () => import('@/views/home/resources/FAQView.vue'),
              meta: {
                title: 'Distribunity: resources',
              },
            },
          ],
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/home/BlogView.vue'),
          meta: {
            title: 'Distribunity: posts',
          },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/home/LoginView.vue'),
          meta: {
            title: 'Distribunity: login',
            avoidIfAuthed: {
              name: 'home',
            },
          },
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/home/SignupView.vue'),
          meta: {
            title: 'Distribunity: signup',
            avoidIfAuthed: {
              name: 'dashboard',
            },
          },
        },
      ],
    },
    {
      path: '/work/',
      name: 'work',
      component: () => import('@/pages/CommonAuthPage.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/auth/DashboardView.vue'),
          meta: {
            title: 'Distribunity: Dashboard',
            requiresAuth: true,
          },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/auth/UserSettingsView.vue'),
          meta: {
            title: 'Distribunity: settings',
            requiresAuth: true,
          },
        },
        {
          path: 'organization/:id/',
          children: [
            {
              path: '',
              name: 'organization-settings',
              component: () => import('@/views/auth/OrganizationAdminView.vue'),
              meta: {
                title: 'Distribunity: organization settings',
                requiresAuth: true,
                requiresOrganizationAdmin: true,
                shouldLoadMember: true,
              },
            },
          ],
        },
      ],
    },
    {
      path: '/work/organization/:id/inventories',
      name: 'organization-inventories',
      component: () => import('@/pages/InventoryPage.vue'),
      meta: {
        title: 'Distribunity: organization inventories',
        requiresAuth: true,
        shouldLoadMember: true,
      },
    },
    {
      path: '/blog',
      redirect: '/blog?page=1',
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: {
        title: 'Page not found',
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const store = useAuthStore();

  await auth.authStateReady();

  if (auth.currentUser?.uid) {
    await store.tryLogUserIn(auth.currentUser.uid);

    if (to.path.toLowerCase().includes('/work/organization') && typeof to.params.id == 'string') {
      await store.loadOrganizationData(to.params.id, auth.currentUser!.uid);
    }

    if (
      to.meta.requiresOrganizationAdmin &&
      getIdFromRefString(store.currentOrganization!.owner.id) != auth.currentUser.uid
    ) {
      return {
        path: '/work',
      };
    } else if (to.meta.avoidIfAuthed && auth.currentUser?.uid) {
      return to.meta.avoidIfAuthed;
    }
  } else if (to.meta.requiresAuth) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    };
  }
});

router.beforeResolve((to) => {
  document.title = to.meta.title ? to.meta.title : DEFAULT_TITLE;
});

export default router;
