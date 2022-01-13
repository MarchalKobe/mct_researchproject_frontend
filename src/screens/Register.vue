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
                <label class="c-input__container u-margin-bottom-md u-margin-right-md" for="firstname">
                    <span class="c-input__label">First name<span class="u-color-alpha">*</span></span>
                    <div class="c-input">
                        <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <input class="c-input__field" type="text" name="firstname" id="firstname" placeholder="John" v-model="registerData.firstName">
                    </div>
                </label>
        
                <label class="c-input__container u-margin-bottom-md" for="lastName">
                    <span class="c-input__label">Last name<span class="u-color-alpha">*</span></span>
                    <div class="c-input">
                        <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <input class="c-input__field" type="text" name="lastname" id="lastname" placeholder="Doe" v-model="registerData.lastName">
                    </div>
                </label>
            </div>
    
            <label class="c-input__container u-margin-bottom-md" for="email">
                <span class="c-input__label">Email<span class="u-color-alpha">*</span></span>
                <div class="c-input">
                    <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <input class="c-input__field" type="text" name="email" id="email" placeholder="john.doe@example.com" v-model="registerData.email">
                </div>
            </label>
    
            <label class="c-input__container u-margin-bottom-md" for="password">
                <span class="c-input__label">Password<span class="u-color-alpha">*</span></span>
                <div class="c-input">
                    <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input class="c-input__field" type="password" name="password" id="password" placeholder="●●●●●●●●●●●●" v-model="registerData.password">
                </div>
            </label>
    
            <label class="c-input__container u-margin-bottom-md" for="confirm">
                <span class="c-input__label">Confirm password<span class="u-color-alpha">*</span></span>
                <div class="c-input">
                    <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input class="c-input__field" type="password" name="confirm" id="confirm" placeholder="●●●●●●●●●●●●" v-model="registerData.confirm">
                </div>
            </label>
    
            <button class="c-button__large u-margin-bottom-md" @click="registerSubmit">Create account</button>
        </form>

        <p class="u-margin-0 u-color-x-light">Already have an account? <RouterLink class="u-color-xx-light c-link" to="/login">Log in</RouterLink></p>
    </div>
</template>
