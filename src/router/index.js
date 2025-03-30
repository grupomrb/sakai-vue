import AppLayout from '@/layout/AppLayout.vue';
import AccountingLayout from '@/layout/modules/accounting/AccountingLayout.vue';
import { FetchService } from '@/service/api/FetchService';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            component: AppLayout,
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/Home.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        // Ruta para manejar rutas no encontradas (debe ser la última)
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        },
        {
            path: '/accounting',
            component: AccountingLayout,
            children: [
                // Añadir children para las rutas hijas
                {
                    path: '', // Ruta por defecto
                    name: 'accounting-home',
                    component: () => import('@/views/pages/accounting/AccountingHome.vue')
                },
                {
                    path: 'master/voucher',
                    name: 'accounting-voucher',
                    component: () => import('@/views/pages/accounting/master/Voucher.vue')
                }
                // Aquí puedes añadir más rutas hijas para el módulo de contabilidad
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    console.log('Navigating to:', to.path);
    // Rutas públicas que no requieren autenticación
    const publicPages = ['/auth/login'];
    const authRequired = !publicPages.includes(to.path);
    const isAuthenticated = FetchService.isAuthenticated();

    if (authRequired && !isAuthenticated) {
        next('/auth/login');
    }

    // Si la ruta es login y ya está autenticado, redirigir a home
    if (to.path === '/auth/login' && isAuthenticated) {
        return next('/home');
    }

    // Add your navigation guard logic here
    next();
});

export default router;
