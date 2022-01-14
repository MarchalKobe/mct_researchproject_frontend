<script setup lang="ts">
    const props = defineProps({
        title: String,
        backAction: Function as () => Function | null,
    });
</script>

<template>
    <header class="c-header u-margin-bottom-md">
        <div class="u-flex u-align-center">
            <button v-if="props.backAction !== undefined" class="c-button__icon c-button__icon-empty u-margin-right-md" @click="props.backAction!()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
    
            <h1 class="c-header__title" style="margin: 0;">{{ props.title }}</h1>
        </div>

        <div class="c-header__ruler-container">
            <div class="c-header__ruler-element u-margin-right-md" />
            <div class="c-header__ruler-element u-margin-right-md" />
            <hr class="c-header__ruler" />
        </div>
    </header>
</template>
