<script setup lang="ts">
    const props = defineProps({
        title: String,
        toggleClose: Function,
        buttonLabel: String,
        buttonAction: Function,
    });
</script>

<Popup title="" :toggleClose="" buttonLabel="" :buttonAction="">

</Popup>

<template>
    <div @click.self="props.toggleClose!()" class="c-popup__container">
        <div class="c-popup">
            <button class="c-popup__button c-button__icon c-button__icon-alpha" @click="props.toggleClose!()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h1 class="c-popup__title">{{ props.title }}</h1>

            <form @submit.prevent>
                <slot></slot>
    
                <div class="u-flex u-align-center u-justify-end">
                    <button class="c-button__normal c-button__normal-alpha" @click="props.buttonAction!()">{{ props.buttonLabel }}</button>
                </div>
            </form>
        </div>
    </div>
</template>
