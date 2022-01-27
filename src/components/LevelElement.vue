<script setup lang="ts">
    import { ref } from 'vue';
    import Category from '../types/Category';
    import Level from '../types/Level';

    const props = defineProps({
        level: Object as () => Level,
        classroomId: String,
        category: Object as () => Category,
    });

    const levels = ref<string[]>(['Easy', 'Normal', 'Hard']);
</script>

<template>
    <div class="u-flex u-align-center u-justify-space-between u-width-18 u-margin-bottom-md" v-if="props.level">
        <p class="u-margin-0">{{ levels[props.level.level! - 1] }}</p>

        <RouterLink v-if="!category!.done" class="c-button__soft u-flex u-align-center" :to="`/classes/${props.classroomId}/makelevel/${props.level.levelId}`">
            <p v-if="props.level.status === 0" class="u-margin-0 u-margin-right-sm">Make level</p>
            <p v-if="props.level.status === 1" class="u-margin-0 u-margin-right-sm">Continue level</p>
            <p v-if="props.level.status === 2" class="u-margin-0 u-margin-right-sm">Edit level</p>
    
            <svg class="u-stroke-x-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h7"/></svg>
        </RouterLink>
    </div>
</template>
