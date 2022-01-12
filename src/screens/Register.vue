<script setup lang="ts">
    import { reactive } from 'vue';
    import RegisterInput from '../types/registerInput';
    import { useNetwork } from '../utils/networkComposable';

    const { register } = useNetwork();

    const registerData = reactive<RegisterInput>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        type: 0,
    });

    const registerSubmit = async () => {
        console.log(registerData);
        const response = await register(registerData);
        console.log({ response });
    };
</script>

<template>
    <h1>Register</h1>
    
    <form @submit.prevent>
        <label for="firstname">
            <span>First name</span>
            <br />
            <input type="text" name="firstname" id="firstname" v-model="registerData.firstName">
        </label>
        <br />
        <label for="lastName">
            <span>Last name</span>
            <br />
            <input type="text" name="lastname" id="lastname" v-model="registerData.lastName">
        </label>
        <br />
        <label for="email">
            <span>Email</span>
            <br />
            <input type="text" name="email" id="email" v-model="registerData.email">
        </label>
        <br />
        <label for="password">
            <span>Password</span>
            <br />
            <input type="password" name="password" id="password" v-model="registerData.password">
        </label>
        <br />
        <label for="type">
            <span>Type</span>
            <br />
            <input type="number" name="type" id="type" v-model="registerData.type">
        </label>
        <br />
        <br />
        <button @click="registerSubmit">Register</button>
    </form>
</template>
