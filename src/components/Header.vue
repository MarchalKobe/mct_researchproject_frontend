<script setup lang="ts">
    const props = defineProps({
        title: String,
        backPath: String as () => String | null,
    });
</script>

<template>
    <header class="c-header u-margin-bottom-md">
        <div class="u-flex u-align-center">
            <RouterLink v-if="props.backPath !== undefined" class="c-button__icon c-button__icon-empty u-margin-right-md" :to="props.backPath">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </RouterLink>
    
            <h1 class="c-header__title" style="margin: 0;">{{ props.title }}</h1>
        </div>

        <div class="c-header__ruler-container">
            <div class="c-header__ruler-element u-margin-right-md" />
            <div class="c-header__ruler-element u-margin-right-md" />
            <hr class="c-header__ruler" />
        </div>
    </header>
</template>
