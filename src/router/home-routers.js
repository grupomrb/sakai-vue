import HomeLayout from '@/layout/home/HomeLayout.vue';

export default [
    {
        path: '/home',
        component: HomeLayout,
        children: [
            {
                path: 'Contabilidad',
                name: 'home-contable',
                component: () => import('@/views/pages/auth/Error.vue')
            },
            {
                path: '',
                redirect: '/home/dashboard'
            }
        ]
    }
];
