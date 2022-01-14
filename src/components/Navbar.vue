<script setup lang="ts">
    import { computed, reactive, ref } from 'vue';
    import router from '../bootstrap/router';
    import store from '../store';
    import { ActionTypes, GetterTypes, UserState } from '../store/modules/user';

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;

    const logout = () => {
        store.dispatch(ActionTypes.LOGOUT_USER).then(() => {
            router.push('/login');
        });
    };
</script>

<template>
    <nav class="c-navbar">
        <div class="u-flex u-direction-column u-align-center">
            <svg class="u-margin-top-md u-margin-bottom-lg" xmlns="http://www.w3.org/2000/svg" width="40.001" height="40" viewBox="0 0 40.001 40">
                <path id="Subtraction_1" data-name="Subtraction 1" d="M20,40A20.005,20.005,0,0,1,12.215,1.572a20.005,20.005,0,0,1,15.57,36.857A19.875,19.875,0,0,1,20,40Zm0-30a10,10,0,1,0,7.071,2.929A9.933,9.933,0,0,0,20,10Z" transform="translate(-0.001 0)" fill="#fff"/>
                <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(15.999 16)" fill="#fff"/>
            </svg>
    
            <RouterLink class="c-button__icon" :class="path === '/classes' ? 'c-button__icon-selected' : ''" to="/classes">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </RouterLink>
        </div>

        <div class="u-flex u-direction-column u-align-center">
            <button class="c-button__icon c-button__icon-alpha u-margin-bottom-md" @click="logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"/></svg>
            </button>

            <div class="c-navbar__profile">
                <RouterLink class="c-button__soft" to="/profile">
                    <div class="c-navbar__avatar" v-html="user.information.avatar"></div>
                </RouterLink>
            </div>
        </div>
    </nav>
</template>
