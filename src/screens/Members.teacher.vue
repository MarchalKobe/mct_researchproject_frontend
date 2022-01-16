<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive, ref } from 'vue';
    import Classroom from '../types/Classroom';
    import { getIdToken, User } from 'firebase/auth';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import UserElement from '../components/UserElement.vue';
    import Input from '../components/Input.vue';

    const { getClassroom } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 2];

    const classroom = ref<Classroom | null>(null);

    const studentsEdit = ref<boolean>(false);
    const toggleStudentsEdit = () => studentsEdit.value = !studentsEdit.value;

    const teachersEdit = ref<boolean>(false);
    const toggleTeachersEdit = () => teachersEdit.value = !teachersEdit.value;

    const inviteStudentPopup = ref<boolean>(false);
    const toggleInviteStudentPopup = () => inviteStudentPopup.value = !inviteStudentPopup.value;

    const inviteTeacherPopup = ref<boolean>(false);
    const toggleInviteTeacherPopup = () => inviteTeacherPopup.value = !inviteTeacherPopup.value;

    const showClasscodePopup = ref<boolean>(false);
    const toggleShowClasscodePopup = () => showClasscodePopup.value = !showClasscodePopup.value;

    const getThisClassroom = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getClassroom(token, classroomId);
            console.log({ response });
            classroom.value = response.data.getClassroom;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const resetClasscodeSubmit = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            // const response = await getClassroom(token, classroomId);
            // console.log({ response });
            // classroom.value = response.data.getClassroom;
        }).catch((error: string) => {
            console.error(error);
        });
    };
    
    const deleteThisStudent = (userId: string) => {
        console.log(`Delete student ${userId}`);
    };
    
    const deleteThisTeacher = (userId: string) => {
        console.log(`Delete teacher ${userId}`);
    };

    getThisClassroom();
</script>

<template>
    <Navbar />

    <div v-if="classroom" class="e-container">
        <Header :title="`${classroom.name} - Members`" backPath="/classes" />

        <nav class="u-flex u-align-center u-justify-center u-margin-bottom-lg">
            <RouterLink class="c-button__soft u-margin-right-x-lg" :class="pathNew[pathNew.length - 1] === 'assignments' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/assignments`">Assignments</RouterLink>
            <RouterLink class="c-button__soft" :class="pathNew[pathNew.length - 1] === 'members' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/members`">Members</RouterLink>
        </nav>

        <button class="c-button__normal u-margin-bottom-md" @click="toggleShowClasscodePopup">Show information</button>

        <section class="u-margin-bottom-x-lg">
            <div class="u-flex u-align-center u-justify-space-between">
                <h2 class="u-weight-400">Students ({{ classroom.users?.filter((user: any) => user.type === 0).length }})</h2>
                <button class="c-button__soft u-color-x-light" @click="toggleStudentsEdit">{{ studentsEdit ? 'Done' : 'Edit' }}</button>
            </div>
            <div class="c-userelements">
                <UserElement name="Invite student" :add="true" @click="toggleInviteStudentPopup" />
                <UserElement v-for="(student, index) in classroom.users?.filter((user: any) => user.type === 0)" :key="index" :user="student" :edit="studentsEdit" :userId="student.userId" :deleteAction="deleteThisStudent" />
            </div>
        </section>

        <section>
            <div class="u-flex u-align-center u-justify-space-between">
                <h2 class="u-weight-400">Teachers ({{ classroom.users?.filter((user: any) => user.type === 1).length }})</h2>
                <button class="c-button__soft u-color-x-light" @click="toggleTeachersEdit">{{ teachersEdit ? 'Done' : 'Edit' }}</button>
            </div>
            <div class="c-userelements">
                <UserElement name="Invite teacher" :add="true" @click="toggleInviteTeacherPopup" />
                <UserElement v-for="(teacher, index) in classroom.users?.filter((user: any) => user.type === 1)" :key="index" :user="teacher" :edit="teachersEdit" :userId="teacher.userId" :deleteAction="deleteThisTeacher" />
            </div>
        </section>
    </div>

    <div v-if="showClasscodePopup" @click.self="toggleShowClasscodePopup" class="c-popup__container">
        <div class="c-popup">
            <button class="c-popup__button c-button__icon c-button__icon-alpha" @click="toggleShowClasscodePopup">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h1 class="c-popup__title">Classroom information</h1>

            <form @submit.prevent>
                <Input label="Classcode" symbol="classroom" type="text" :placeholder="classroom?.classcode" :model="classroom!" modelName="" />
    
                <div class="u-flex u-align-center u-justify-end">
                    <button class="c-button__normal c-button__normal-alpha" @click="resetClasscodeSubmit">Reset classcode</button>
                </div>
            </form>
        </div>
    </div>
</template>
