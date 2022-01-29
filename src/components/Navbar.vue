<script setup lang="ts">
    import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
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

    const open = ref<boolean>(false);
    const toggleOpen = () => open.value = !open.value;

    const width = ref<number>(window.innerWidth);
    const getWidth = () => width.value = window.innerWidth;
    onMounted(() => window.addEventListener('resize', getWidth));
    onUnmounted(() => window.removeEventListener('resize', getWidth));
</script>

<template>
    <button v-if="width <= 960" class="c-navbar__button-mobile" @click="toggleOpen">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>

    <nav class="c-navbar" :class="open ? 'c-navbar__open' : ''">
        <button class="c-navbar__button" :style="{ transform: `rotateY(${open ? '180deg' : '0'})` }" @click="toggleOpen">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <div class="c-navbar__section">
            <svg class="c-navbar__logo u-margin-top-md u-margin-bottom-lg" xmlns="http://www.w3.org/2000/svg" width="40.001" height="40" viewBox="0 0 40.001 40">
                <path id="Subtraction_1" data-name="Subtraction 1" d="M20,40A20.005,20.005,0,0,1,12.215,1.572a20.005,20.005,0,0,1,15.57,36.857A19.875,19.875,0,0,1,20,40Zm0-30a10,10,0,1,0,7.071,2.929A9.933,9.933,0,0,0,20,10Z" transform="translate(-0.001 0)" fill="#fff"/>
                <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(15.999 16)" fill="#fff"/>
            </svg>
    
            <RouterLink class="c-navbar__element c-button__icon" :class="{ 'c-button__icon-selected': path === '/classes', 'c-button__icon-open': open }" to="/classes" data-information="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span v-if="open">Home</span>
            </RouterLink>
        </div>

        <div class="c-navbar__section">
            <button class="c-navbar__element c-button__icon c-button__icon-alpha u-margin-bottom-md" :class="open ? 'c-button__icon-open' : ''" @click="logout" data-information="Log out">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"/></svg>
                <span v-if="open">Log out</span>
            </button>

            <RouterLink class="c-navbar__profile c-navbar__element c-button__soft" to="/profile" data-information="Profile">
                <div class="c-navbar__avatar" v-html="user.information.avatar"></div>
                <div v-if="open">
                    <p class="c-navbar__profile-name">{{ user.information.firstName }} {{ user.information.lastName }}</p>
                    <p class="c-navbar__profile-settings">Profile</p>
                </div>
            </RouterLink>
        </div>
    </nav>
</template>
