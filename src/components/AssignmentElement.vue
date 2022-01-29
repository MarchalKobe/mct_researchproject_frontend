<script setup lang="ts">
    import { ref, watch } from 'vue';
    import Assignment from '../types/Assignment';
    import Level from '../types/Level';
    import Score from '../types/Score';

    const props = defineProps({
        add: Boolean as () => boolean | null,
        name: String as () => string | null,
        assignment: Object as () => Assignment | null,
        showScore: Boolean as () => boolean | null,
        current: Boolean as () => boolean | null,
        edit: Boolean as () => boolean | null,
        // userId: String as () => string | null,
        setRef: Function as () => Function | null,
        index: Number as () => number | null,
        openLabel: String as () => string | null,
        updateAction: Function as () => Function | null,
        deleteAction: Function as () => Function | null,
        clickAction: Function as () => Function | null,
    });

    const open = ref<boolean>(false);
    const toggleOpen = () => open.value = !open.value;

    const level = ref<Level>();
    const score = ref<Score>();

    if(props.current) {
        props.assignment!.levels!.map((lev: Level) => {
            lev.scores!.map((sco: Score) => {
                if(sco.status === 0) {
                    level.value = lev;
                    score.value = sco;
                };
            });
        });
    };

    watch(() => props.edit, () => {
        if(props.edit) open.value = false;
    });
</script>

<template>
    <div :ref="(props.setRef! as any)" :data-index="props.index">
        <button v-if="props.assignment && props.edit" class="c-assignmentelement__button2 c-button__icon c-button__icon-orange" @click="props.updateAction!(props.assignment?.assignmentId)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
        </button>
        <button v-if="props.assignment && props.edit" class="c-assignmentelement__button c-button__icon c-button__icon-alpha" @click="props.deleteAction!(props.assignment?.assignmentId)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
        
        <div v-if="props.add" class="c-assignmentelement c-assignmentelement-add u-flex u-align-center" @click="props.clickAction ? props.clickAction(props.assignment?.assignmentId) : null">
            <div class="u-flex u-align-center u-justify-center u-width-full">
                <h2 class="c-assignmentelement__name u-margin-right-x-lg">{{ props.name }}</h2>
                <svg class="c-assignmentelement__symbol" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        </div>
        <div v-else>
            <div class="u-flex u-align-center u-justify-space-between u-width-full">
                <div class="u-flex u-direction-column u-justify-space-between u-height-full">
                    <h3 class="c-assignmentelement__category u-margin-bottom-md">{{ props.assignment!.category!.name }}</h3>
                    <h2 class="c-assignmentelement__subject">{{ props.assignment!.subject }}</h2>
                </div>
                <div v-if="!props.edit && props.openLabel" class="u-flex u-align-center">
                    <p v-if="props.showScore && assignment" class="u-margin-right-md u-size-20">{{ assignment.total }}%</p>
                    <div class="c-button__soft u-flex u-align-center" @click="toggleOpen">
                        <p class="u-margin-right-sm u-color-x-light">{{ props.openLabel }}</p>
                        <svg class="c-assignmentelement__symbol" :style="{ transform: `rotateX(${open ? '-180deg' : '0'})` }" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                </div>
                <div v-else-if="props.current">
                    <div v-if="level" class="c-button__soft u-flex u-align-center" @click="props.clickAction ? props.clickAction(score!.scoreId) : null">
                        <p class="u-margin-right-sm u-color-x-light">Start assignment</p>
                        <svg class="c-assignmentelement__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h7"/></svg>
                    </div>
                    <p v-else class="u-margin-0 u-color-x-light">Finish previous assignment first</p>
                </div>
            </div>
            <div v-if="open" class="u-margin-top-md">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
