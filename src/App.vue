<script setup lang="ts">
    import './styles/screen.scss';
    import Alert from './components/Alert.vue';
    import { useAlerts } from './store/alerts';

    const { alerts } = useAlerts();
</script>

<template>
    <RouterView></RouterView>

    <div v-if="alerts.length" class="c-alert__container">
        <Alert v-for="(alert, index) in alerts" :key="index" :alert="alert" />
    </div>
</template>
