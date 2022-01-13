<script setup lang="ts">
    const props = defineProps({
        title: String,
    });
</script>

<template>
    <div class="c-header">
        <h1 class="c-header__title" style="margin: 0;">{{ props.title }}</h1>
        <div class="c-header__ruler-container">
            <div class="c-header__ruler-element u-margin-right-md" />
            <div class="c-header__ruler-element u-margin-right-md" />
            <hr class="c-header__ruler" />
        </div>
    </div>
</template>
