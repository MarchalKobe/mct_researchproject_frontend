<script setup lang="ts">
    const props = defineProps({
        progress: Number,
    });

    console.log(props);
    
</script>

<template>
    <div class="c-progressbar__container">
        <div class="c-progressbar" :class="{ 'c-progressbar__green': props.progress! >= 90, 'c-progressbar__orange': props.progress! >= 50 && props.progress! < 90, 'c-progressbar__red': props.progress! < 50 }" :style="{ width: `${props.progress}%` }"></div>
    </div>
</template>
