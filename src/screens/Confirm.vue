<script setup lang="ts">
    import { ref } from 'vue';
    import { useNetwork } from '../utils/networkComposable';

    const { confirm } = useNetwork();

    const token = ref<string | null>(new URL(location.href).searchParams.get('token'));

    const confirmSubmit = async () => {
        if(token.value) {
            const response = await confirm(token.value);
            console.log({ response });
        };
    };
</script>

<template>
    <h1>Confirm</h1>

    <button @click="confirmSubmit">Confirm email</button>
</template>
