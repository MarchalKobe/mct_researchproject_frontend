<script setup lang="ts">
    import { UserState } from '../store/modules/user';
    import Classroom from '../types/Classroom';

    const props = defineProps({
        add: Boolean as () => boolean | null,
        name: String as () => string | null,
        classroom: Object as () => Classroom | null,
        edit: Boolean as () => boolean | null,
        user: Object as () => UserState | null,
        leaveAction: Function as () => Function | null,
        updateAction: Function as () => Function | null,
        dupplicateAction: Function as () => Function | null,
        closeAction: Function as () => Function | null,
        clickAction: Function as () => Function | null,
    });
</script>

<template>
    <div class="c-classelement__container">
        <button v-if="props.classroom && props.edit && props.user!.user!.uid !== props.classroom.userCreated!.userId" class="c-classelement__button c-button__icon c-button__icon-alpha" @click="props.leaveAction ? props.leaveAction(props.classroom?.classroomId) : null">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <button v-if="props.edit && props.user?.type === 1" class="c-button__icon c-button__icon-orange" :class="props.classroom?.open ? 'c-classelement__button3' : 'c-classelement__button'" @click="props.dupplicateAction ? props.dupplicateAction(props.classroom) : null">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>

        <button v-if="props.classroom?.open && props.edit && props.user?.type === 1" class="c-classelement__button2 c-button__icon c-button__icon-orange" @click="props.updateAction ? props.updateAction(props.classroom) : null">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
        </button>

        <button v-if="props.classroom?.open && props.edit && props.user?.type === 1" class="c-classelement__button c-button__icon c-button__icon-alpha" @click="props.closeAction ? props.closeAction(props.classroom!.classroomId) : null">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div class="c-classelement" :class="[props.add ? 'c-classelement-add' : '', props.classroom && !props.classroom.open ? 'c-classelement__isclosed' : '']" @click="props.clickAction ? props.clickAction(props.classroom?.classroomId) : null">
            <svg v-if="props.add" class="c-classelement__symbol" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <svg v-else class="c-classelement__symbol" xmlns="http://www.w3.org/2000/svg" width="50" height="37" viewBox="0 0 50 37">
                <path id="icons8-class" d="M2.813,8A1,1,0,0,0,2,9V38H.906A1,1,0,0,0,0,39v5a1,1,0,0,0,1,1H49a1,1,0,0,0,1-1V39a1,1,0,0,0-1-1H48V9a1,1,0,0,0-1-1H2.813ZM4,10H46V38H21.906L23,36l-1.094-2H11v4H4Zm35,4.969a1.536,1.536,0,0,0-.594.219L25.031,24.719l-5.406-4.5a1,1,0,0,0-1.219-.031l-8,6a1.006,1.006,0,0,0,1.188,1.625l7.375-5.531,5.406,4.5a1,1,0,0,0,1.219.031l14-10A1,1,0,0,0,39,14.969ZM2,40H48v3H2Z" transform="translate(0 -8)" fill="#A2A8B0"/>
            </svg>
    
            <h2 class="c-classelement__name">{{ props.classroom?.name || props.name }}</h2>

            <p v-if="props.classroom && !props.classroom.open" class="c-classelement__closed">Closed</p>

            <p v-if="props.classroom && props.classroom.userCreated?.userId === props.user!.user!.uid" class="c-classelement__createdby">Created by me</p>
        </div>
    </div>
</template>
