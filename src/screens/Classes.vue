<script setup lang="ts">
    import router from '../bootstrap/router';
    import store from '../store';
    import { ActionTypes } from '../store/modules/user';

    const logout = () => {
        store.dispatch(ActionTypes.LOGOUT_USER).then(() => {
            router.push('/login');
        });
    };
</script>

<template>
    <h1>Classes</h1>
    <button @click="logout">Log out</button>
</template>
