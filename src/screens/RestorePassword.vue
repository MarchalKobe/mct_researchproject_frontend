<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import router from '../bootstrap/router';
    import { useLoading } from '../store/loading';
    import RestorePasswordInput from '../types/RestorePasswordInput';
    import { useNetwork } from '../utils/networkComposable';

    const { restorePassword } = useNetwork();

    const { addLoading, removeLoading } = useLoading();

    const token = ref<string | null>(new URL(location.href).searchParams.get('token'));

    const restorePasswordData = reactive<RestorePasswordInput>({
        password: '',
        confirm: '',
    });

    const restorePasswordSubmit = async () => {
        if(token.value) {
            addLoading();

            const response = await restorePassword(token.value, restorePasswordData);

            removeLoading();

            // TODO: Check response
            window.alert('Password has been restored.');
            router.push('/login');
        };
    };
</script>

<template>
    <div class="e-container__small">
        <svg class="u-margin-top-x-lg u-margin-bottom-lg" xmlns="http://www.w3.org/2000/svg" width="40.001" height="40" viewBox="0 0 40.001 40">
            <path id="Subtraction_1" data-name="Subtraction 1" d="M20,40A20.005,20.005,0,0,1,12.215,1.572a20.005,20.005,0,0,1,15.57,36.857A19.875,19.875,0,0,1,20,40Zm0-30a10,10,0,1,0,7.071,2.929A9.933,9.933,0,0,0,20,10Z" transform="translate(-0.001 0)" fill="#fff"/>
            <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(15.999 16)" fill="#fff"/>
        </svg>

        <h1 class="u-margin-0 u-margin-bottom-x-lg">Restore password.</h1>

        <form @submit.prevent>
            <label class="c-input__container u-margin-bottom-md" for="password">
                <span class="c-input__label">Password</span>
                <div class="c-input">
                    <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input class="c-input__field" type="password" name="password" id="password" placeholder="●●●●●●●●●●●●" v-model="restorePasswordData.password">
                </div>
            </label>

            <label class="c-input__container u-margin-bottom-md" for="confirm">
                <span class="c-input__label">Confirm password</span>
                <div class="c-input">
                    <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <input class="c-input__field" type="password" name="confirm" id="confirm" placeholder="●●●●●●●●●●●●" v-model="restorePasswordData.confirm">
                </div>
            </label>

            <button class="c-button__large u-margin-bottom-md" @click="restorePasswordSubmit">Restore password</button>
        </form>

        <p class="u-margin-0 u-color-x-light">Didn't forget? <RouterLink class="u-color-xx-light c-link" to="/login">Log in</RouterLink></p>
    </div>
</template>
