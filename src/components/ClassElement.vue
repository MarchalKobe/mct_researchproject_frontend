<script setup lang="ts">
    import Classroom from '../types/Classroom';

    const props = defineProps({
        add: Boolean as () => boolean | null,
        name: String as () => string | null,
        classroom: Object as () => Classroom | null,
        edit: Boolean as () => boolean | null,
        userId: String as () => string | null,
        leaveAction: Function as () => Function | null,
        deleteAction: Function as () => Function | null,
        clickAction: Function as () => Function | null,
    });
</script>

<template>
    <div class="c-classelement__container">
        <button v-if="props.classroom && props.edit && props.userId !== props.classroom.userCreated.userId" class="c-classelement__button c-button__icon c-button__icon-alpha" @click="leaveAction!(classroom?.classroomId)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <!-- TODO: Delete class button -->
        <!-- <button v-if="props.classroom && props.edit && props.userId === props.classroom.userCreated.userId" class="c-classelement__button c-button__icon c-button__icon-alpha" @click="props.deleteAction!(props.classroom?.classroomId)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button> -->
        
        <div class="c-classelement" :class="props.add ? 'c-classelement-add' : ''" @click="props.clickAction ? props.clickAction(props.classroom?.classroomId) : null">
            <svg v-if="props.add" class="c-classelement__symbol" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <svg v-else class="c-classelement__symbol" xmlns="http://www.w3.org/2000/svg" width="50" height="37" viewBox="0 0 50 37">
                <path id="icons8-class" d="M2.813,8A1,1,0,0,0,2,9V38H.906A1,1,0,0,0,0,39v5a1,1,0,0,0,1,1H49a1,1,0,0,0,1-1V39a1,1,0,0,0-1-1H48V9a1,1,0,0,0-1-1H2.813ZM4,10H46V38H21.906L23,36l-1.094-2H11v4H4Zm35,4.969a1.536,1.536,0,0,0-.594.219L25.031,24.719l-5.406-4.5a1,1,0,0,0-1.219-.031l-8,6a1.006,1.006,0,0,0,1.188,1.625l7.375-5.531,5.406,4.5a1,1,0,0,0,1.219.031l14-10A1,1,0,0,0,39,14.969ZM2,40H48v3H2Z" transform="translate(0 -8)" fill="#A2A8B0"/>
            </svg>
    
            <h2 class="c-classelement__name">{{ props.classroom?.name || props.name }}</h2>
        </div>
    </div>
</template>
