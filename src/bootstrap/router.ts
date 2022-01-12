import { computed } from '@vue/reactivity';
import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router';
import store from '../store';
import { GetterTypes, UserState } from '../store/modules/user';

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('../screens/Login.vue'),
        meta: {
            loggedIn: false,
            teacher: false,
        },
    },
    {
        path: '/register',
        component: () => import('../screens/Register.vue'),
        meta: {
            loggedIn: false,
            teacher: false,
        },
    },
];

const router: Router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    // if(to.meta.loggedIn) {
    //     const user: UserState = computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value;

    //     if(user.loggedIn) {
    //         if(to.meta.teacher) {
    //             if(user.type === 1) {
    //                 next();
    //             } else {
    //                 next('/login');
    //             };
    //         } else {
    //             next();
    //         };
    //     } else {
    //         next('/login');
    //     };
    // } else {
    //     next();
    // };
});

export default router;
