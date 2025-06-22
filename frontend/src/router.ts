import { createRouter, createWebHistory } from 'vue-router';
import 'vue-router';
import useAuthStore from './store/auth';
import { AuthState } from './types';

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
      path: '',
      alias: ['/home'],
      name: 'home-view',
      component: () => import('@/layouts/HomeLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/public/HomeView.vue'),
        },
        {
          path: 'resources',
          alias: ['help', 'support', 'about'],
          name: 'resources-view',
          component: () => import('@/views/public/ResourcesView.vue'),
          children: [
            {
              path: '',
              name: 'resources',
              component: () => import('@/views/public/resources/FAQView.vue'),
              meta: {
                title: 'Distribunity | Resources',
              },
            },
          ],
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/public/BlogView.vue'),
          meta: {
            title: 'Distribunity | Blog',
          },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/public/LoginView.vue'),
          meta: {
            title: 'Distribunity | Login',
            avoidIfAuthed: {
              name: 'home',
            },
          },
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/public/SignupView.vue'),
          meta: {
            title: 'Distribunity | Signup',
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
      component: () => import('@/layouts/CommonAuthPage.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/logged-in/DashboardView.vue'),
          meta: {
            title: 'Distribunity | Dashboard',
            requiresAuth: true,
          },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/logged-in/UserSettingsView.vue'),
          meta: {
            title: 'Distribunity | Settings',
            requiresAuth: true,
          },
        },
        {
          path: 'organization/:id/',
          children: [
            {
              path: '',
              name: 'organization-settings',
              component: () => import('@/views/logged-in/OrganizationAdminView.vue'),
              meta: {
                title: 'Distribunity | Organization settings',
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
      component: () => import('@/layouts/InventoryPage.vue'),
      meta: {
        title: 'Distribunity | Organization inventories',
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
      component: () => import('@/layouts/NotFoundPage.vue'),
      meta: {
        title: 'Page not found',
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  await auth.authReady;

  if (auth.state == AuthState.LoggedIn) {
    if (to.path.toLowerCase().includes('/work/organization') && typeof to.params.id == 'string')
      await auth.loadOrganization(to.params.id);

    if (to.meta.requiresOrganizationAdmin && !auth.isOrganizationOwner())
      return {
        path: '/work',
      };

    if (to.meta.avoidIfAuthed) return to.meta.avoidIfAuthed;
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
