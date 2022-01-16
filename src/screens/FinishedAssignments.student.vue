<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive, ref } from 'vue';
    import Classroom from '../types/Classroom';
    import { getIdToken, User } from 'firebase/auth';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';

    const { getClassroom } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 2];

    const classroom = ref<Classroom | null>(null);

    const getThisClassroom = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getClassroom(token, classroomId);
            console.log({ response });
            classroom.value = response.data.getClassroom;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    getThisClassroom();
</script>

<template>
    <Navbar />

    <div v-if="classroom" class="e-container">
        <Header :title="`${classroom.name} - Finished Assignments`" backPath="/classes" />
    </div>
</template>
