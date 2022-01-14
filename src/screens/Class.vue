<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classname = pathNew[pathNew.length - 1];
</script>

<template>
    <Navbar />

    <div class="e-container">
        <Header :title="`${classname} - Assignments`" />
    </div>
</template>
