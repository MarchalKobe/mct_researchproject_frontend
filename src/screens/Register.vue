<script setup lang="ts">
    import { reactive } from 'vue';
    import RegisterInput from '../types/RegisterInput';
    import { useNetwork } from '../utils/networkComposable';
    import Input from '../components/Input.vue';

    const { register } = useNetwork();

    const registerData = reactive<RegisterInput>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirm: '',
        type: 0,
    });

    const registerSubmit = async () => {
        console.log(registerData);
        const response = await register(registerData);
        console.log({ response });

        // TODO: Check response
        window.alert(`An email has been send to ${registerData.email} with your confirmation link.`);
    };
</script>

<template>
    <div class="e-container__small">
        <svg class="u-margin-top-x-lg u-margin-bottom-lg" xmlns="http://www.w3.org/2000/svg" width="40.001" height="40" viewBox="0 0 40.001 40">
            <path id="Subtraction_1" data-name="Subtraction 1" d="M20,40A20.005,20.005,0,0,1,12.215,1.572a20.005,20.005,0,0,1,15.57,36.857A19.875,19.875,0,0,1,20,40Zm0-30a10,10,0,1,0,7.071,2.929A9.933,9.933,0,0,0,20,10Z" transform="translate(-0.001 0)" fill="#fff"/>
            <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(15.999 16)" fill="#fff"/>
        </svg>

        <h1 class="u-margin-0 u-margin-bottom-lg">Create account.</h1>

        <div class="c-switch u-margin-bottom-md">
            <button class="c-switch__element u-margin-right-x-sm" :class="registerData.type === 0 ? 'c-switch__element-selected' : ''" @click="registerData.type = 0">Student</button>
            <button class="c-switch__element" :class="registerData.type === 1 ? 'c-switch__element-selected' : ''" @click="registerData.type = 1">Teacher</button>
        </div>

        <form @submit.prevent>
            <div class="u-flex">
                <Input class="u-margin-right-md" label="First name" symbol="user" type="text" placeholder="John" :model="registerData" modelName="firstName" :required="true" />
                <Input label="Last name" symbol="user" type="text" placeholder="Doe" :model="registerData" modelName="lastName" :required="true" />
            </div>

            <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="registerData" modelName="email" :required="true" />
            <Input label="Password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="registerData" modelName="password" :required="true" />
            <Input label="Confirm password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="registerData" modelName="confirm" :required="true" />
    
            <button class="c-button__large u-margin-bottom-md" @click="registerSubmit">Create account</button>
        </form>

        <p class="u-margin-0 u-color-x-light">Already have an account? <RouterLink class="u-color-xx-light c-link" to="/login">Log in</RouterLink></p>
    </div>
</template>
