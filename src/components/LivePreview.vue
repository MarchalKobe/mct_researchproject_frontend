<script setup lang="ts">
    import { ref, watch } from 'vue';

    const props = defineProps({
        code: String,
    });

    const title = ref<string>('No title found');

    const setTitle = () => {
        try {
            const { head } = new DOMParser().parseFromString(props.code!, 'text/html');
            title.value = head.querySelector('title')!.innerText;
        } catch {
            title.value = 'No title found';
        };
    };

    setTitle();

    watch(() => props.code, () => {
        setTitle();
    });
</script>

<template>
    <section class="c-livepreview__container">
        <div class="c-livepreview__header">
            <p class="c-livepreview__label u-margin-right-sm">Assignment</p>
            <button class="c-button__header c-button__header-selected">{{ title }}</button>
        </div>
        <iframe class="c-livepreview" :srcdoc="props.code" frameborder="0" style="background: white; width: 100%; height: 100%;"></iframe>
    </section>
</template>
