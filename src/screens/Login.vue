<script setup lang="ts">
    import { reactive } from 'vue';
    import { useNetwork } from '../utils/networkComposable';
    import { getAuth, signInWithCustomToken, Auth, UserCredential } from 'firebase/auth';
    import router from '../bootstrap/router';
    import Input from '../components/Input.vue';
    import LoginInput, { LoginError } from '../types/LoginInput';
    import { validateEmail } from '../helpers/ValidateEmail';
    import { useLoading } from '../store/loading';

    const auth: Auth = getAuth();

    const { login } = useNetwork();

    const { addLoading, removeLoading } = useLoading();

    const loginData = reactive<LoginInput>({
        email: '',
        password: '',
    });

    const loginError = reactive<LoginError>({
        email: null,
        password: null,
    });

    const loginSubmit = async () => {
        addLoading();

        loginError.email = loginData.email.length ? null : 'Field required';
        if(!loginError.email) loginError.email = validateEmail(loginData.email) ? null : 'Not a valid email address';
        
        loginError.password = loginData.password.length ? null : 'Field required';
        if(!loginError.password) loginError.password = loginData.password.length >= 5 ? null : 'At least 5 characters';

        if(!Object.values(loginError).every(error => error === null)) return;

        const response = await login(loginData);

        if(response.data.login) {
            signInWithCustomToken(auth, response.data.login.token).then((_: UserCredential) => {
                router.push('/classes');
            }).catch((error: any) => {
                console.error(error);
            });
        } else {
            // TODO: Error: email or password is wrong or account has not been confirmed
            window.alert('Email or password is wrong or account has not been confirmed.');
        };

        removeLoading();
    };
</script>

<template>
    <div class="e-container__small">
        <svg class="u-margin-top-x-lg u-margin-bottom-lg" xmlns="http://www.w3.org/2000/svg" width="40.001" height="40" viewBox="0 0 40.001 40">
            <path id="Subtraction_1" data-name="Subtraction 1" d="M20,40A20.005,20.005,0,0,1,12.215,1.572a20.005,20.005,0,0,1,15.57,36.857A19.875,19.875,0,0,1,20,40Zm0-30a10,10,0,1,0,7.071,2.929A9.933,9.933,0,0,0,20,10Z" transform="translate(-0.001 0)" fill="#fff"/>
            <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(15.999 16)" fill="#fff"/>
        </svg>

        <h1 class="u-margin-0 u-margin-bottom-x-lg">Log in.</h1>

        <form @submit.prevent>
            <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="loginData" modelName="email" :error="loginError.email" />
            <Input label="Password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="loginData" modelName="password" :error="loginError.password" />

            <button class="c-button__large u-margin-bottom-md" @click="loginSubmit">Log in</button>
        </form>

        <p class="u-margin-0 u-color-x-light">Don't have an account? <RouterLink class="u-color-xx-light c-link" to="/register">Create one</RouterLink></p>
        <RouterLink class="u-margin-0 c-link" to="/forgotpassword">Forgot password?</RouterLink>
    </div>
</template>
