<script setup lang="ts">
    import { reactive } from 'vue';
    import ForgotPasswordInput from '../types/ForgotPasswordInput';
    import { useNetwork } from '../utils/networkComposable';
    import Input from '../components/Input.vue';

    const { forgotPassword } = useNetwork();

    const forgotPasswordData = reactive<ForgotPasswordInput>({
        email: '',
    });

    const forgotPasswordSubmit = async () => {
        const response = await forgotPassword(forgotPasswordData);

        // TODO: Check response
        window.alert(`You will receive an email at ${forgotPasswordData.email} if it exists.`);
    };
</script>

<template>
    <div class="e-container__small">
        <svg class="u-margin-top-x-lg u-margin-bottom-lg" xmlns="http://www.w3.org/2000/svg" width="40.001" height="40" viewBox="0 0 40.001 40">
            <path id="Subtraction_1" data-name="Subtraction 1" d="M20,40A20.005,20.005,0,0,1,12.215,1.572a20.005,20.005,0,0,1,15.57,36.857A19.875,19.875,0,0,1,20,40Zm0-30a10,10,0,1,0,7.071,2.929A9.933,9.933,0,0,0,20,10Z" transform="translate(-0.001 0)" fill="#fff"/>
            <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(15.999 16)" fill="#fff"/>
        </svg>

        <h1 class="u-margin-0 u-margin-bottom-x-lg">Forgot password.</h1>

        <form @submit.prevent>
            <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="forgotPasswordData" modelName="email" />

            <button class="c-button__large u-margin-bottom-md" @click="forgotPasswordSubmit">Forgot password</button>
        </form>

        <p class="u-margin-0 u-color-x-light">Didn't forget? <RouterLink class="u-color-xx-light c-link" to="/login">Log in</RouterLink></p>
    </div>
</template>
