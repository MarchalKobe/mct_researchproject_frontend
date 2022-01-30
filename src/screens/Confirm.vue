<script setup lang="ts">
    import { ref } from 'vue';
    import router from '../bootstrap/router';
    import { useLoading } from '../store/loading';
    import { useNetwork } from '../utils/networkComposable';

    const { confirm } = useNetwork();

    const { addLoading, removeLoading } = useLoading();

    const token = ref<string | null>(new URL(location.href).searchParams.get('token'));

    const confirmSubmit = async () => {
        if(token.value) {
            addLoading();
            
            const response = await confirm(token.value);

            removeLoading();

            window.alert('Account has been confirmed');
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

        <h1 class="u-margin-0 u-margin-bottom-x-lg">Confirm account.</h1>

        <button class="c-button__large u-margin-bottom-md" @click="confirmSubmit">Confirm account</button>

        <p class="u-margin-0 u-color-x-light">Don't need to confirm? <RouterLink class="u-color-xx-light c-link" to="/login">Log in</RouterLink></p>
    </div>
</template>
