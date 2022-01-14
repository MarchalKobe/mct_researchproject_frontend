import { computed } from '@vue/reactivity';
import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router';
import store from '../store';
import { GetterTypes, UserState } from '../store/modules/user';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/classes',
    },
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
    {
        path: '/confirm',
        component: () => import('../screens/Confirm.vue'),
        meta: {
            loggedIn: false,
            teacher: false,
        },
    },
    {
        path: '/forgotpassword',
        component: () => import('../screens/ForgotPassword.vue'),
        meta: {
            loggedIn: false,
            teacher: false,
        },
    },
    {
        path: '/restorepassword',
        component: () => import('../screens/RestorePassword.vue'),
        meta: {
            loggedIn: false,
            teacher: false,
        },
    },
    {
        path: '/profile',
        component: () => import('../screens/Profile.vue'),
        meta: {
            loggedIn: true,
            teacher: false,
        },
    },
    {
        path: '/classes',
        component: () => import('../screens/Classes.vue'),
        meta: {
            loggedIn: true,
            teacher: false,
        },
    },
    {
        path: '/classes/:classroomId',
        component: () => import('../screens/Class.vue'),
        meta: {
            loggedIn: true,
            teacher: false,
        },
    },
];

export const router: Router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    if(to.meta.loggedIn) {
        const user: UserState = computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value;

        if(user.loggedIn) {
            if(to.meta.teacher) {
                if(user.type !== 1) {
                    next('/login');
                    return;
                };
            };
        } else {
            next('/login');
            return;
        };
    };

    next();
});

export default router;
