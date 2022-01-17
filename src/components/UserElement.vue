<script setup lang="ts">
    import Classroom from '../types/Classroom';
    import UserType from '../types/UserType';

    const props = defineProps({
        add: Boolean as () => boolean | null,
        name: String as () => string | null,
        user: Object as () => UserType | null,
        classroom: Object as () => Classroom | null,
        edit: Boolean as () => boolean | null,
        userId: String as () => string | null,
        deleteAction: Function as () => Function | null,
        clickAction: Function as () => Function | null,
    });
</script>

<template>
    <div class="c-userelement__container">
        <button v-if="props.edit && (props.userId !== props.user?.userId && props.user?.userId !== props.classroom?.userCreated?.userId)" class="c-userelement__button c-button__icon c-button__icon-alpha" @click="props.deleteAction!(props.user?.userId)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div class="c-userelement" :class="props.add ? 'c-userelement-add' : ''" @click="props.clickAction ? props.clickAction(props.user?.userId) : null">
            <svg v-if="props.add" class="c-userelement__symbol" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <div v-else class="c-userelement__avatar" v-html="props.user?.avatar"></div>
    
            <h2 class="c-userelement__name">{{ props.user ? `${props.user?.firstName} ${props.user?.lastName}` : props.name }}</h2>

            <p v-if="props.user && props.user.userId === props.classroom?.userCreated?.userId" class="c-userelement__me">Created by</p>
        </div>
    </div>
</template>
