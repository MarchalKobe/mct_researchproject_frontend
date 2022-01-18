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
    },
    {
        path: '/register',
        component: () => import('../screens/Register.vue'),
    },
    {
        path: '/confirm',
        component: () => import('../screens/Confirm.vue'),
    },
    {
        path: '/forgotpassword',
        component: () => import('../screens/ForgotPassword.vue'),
    },
    {
        path: '/restorepassword',
        component: () => import('../screens/RestorePassword.vue'),
    },
    {
        path: '/profile',
        component: () => import('../screens/Profile.vue'),
        meta: {
            loggedIn: true,
            roles: ['STUDENT', 'TEACHER'],
        },
    },
    {
        path: '/classes',
        component: () => import('../screens/Classes.vue'),
        meta: {
            loggedIn: true,
            roles: ['STUDENT', 'TEACHER'],
        },
    },
    {
        path: '/classes/:classroomId/assignments',
        component: () => import('../screens/Assignments.teacher.vue'),
        meta: {
            loggedIn: true,
            roles: ['TEACHER'],
        },
    },
    {
        path: '/classes/:classroomId/makelevel/:levelId',
        component: () => import('../screens/Level.teacher.vue'),
        meta: {
            loggedIn: true,
            roles: ['TEACHER'],
        },
    },
    {
        path: '/classes/:classroomId/members',
        component: () => import('../screens/Members.teacher.vue'),
        meta: {
            loggedIn: true,
            roles: ['TEACHER'],
        },
    },
    {
        path: '/classes/:classroomId/currentassignments',
        component: () => import('../screens/CurrentAssignments.student.vue'),
        meta: {
            loggedIn: true,
            roles: ['STUDENT'],
        },
    },
    {
        path: '/classes/:classroomId/finishedassignments',
        component: () => import('../screens/FinishedAssignments.student.vue'),
        meta: {
            loggedIn: true,
            roles: ['STUDENT'],
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
            const roles = ['STUDENT', 'TEACHER'];
            const role = roles[user.type];

            if(!(to.meta.roles as String[]).includes(role)) {
                next('/');
                return;
            };
        } else {
            next('/');
            return;
        };
    };

    next();
});

export default router;
