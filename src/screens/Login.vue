<script setup lang="ts">
    import { reactive } from 'vue';
    import LoginInput from '../types/loginInput';
    import { useNetwork } from '../utils/networkComposable';

    const { login } = useNetwork();

    const loginData = reactive<LoginInput>({
        email: '',
        password: '',
    });

    const loginSubmit = async () => {
        console.log(loginData);
        const response = await login(loginData);
        console.log({ response });
    };
</script>

<template>
    <h1>Login</h1>
    
    <form @submit.prevent>
        <label for="email">
            <span>Email</span>
            <br />
            <input type="text" name="email" id="email" v-model="loginData.email">
        </label>
        <br />
        <label for="password">
            <span>Password</span>
            <br />
            <input type="password" name="password" id="password" v-model="loginData.password">
        </label>
        <br />
        <br />
        <button @click="loginSubmit">Login</button>
    </form>
</template>
