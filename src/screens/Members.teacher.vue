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
    import Popup from '../components/Popup.vue';
    import InviteInput from '../types/InviteInput';

    const { getClassroom, resetClasscode, deleteUserFromClassroom, inviteUserToClassroom } = useNetwork();

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

    const showClasscodePopup = ref<boolean>(false);
    const toggleShowClasscodePopup = () => showClasscodePopup.value = !showClasscodePopup.value;

    const inviteStudentPopup = ref<boolean>(false);
    const toggleInviteStudentPopup = () => inviteStudentPopup.value = !inviteStudentPopup.value;

    const inviteStudent = reactive<InviteInput>({
        email: '',
    });

    const inviteTeacherPopup = ref<boolean>(false);
    const toggleInviteTeacherPopup = () => inviteTeacherPopup.value = !inviteTeacherPopup.value;

    const inviteTeacher = reactive<InviteInput>({
        email: '',
    });

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
            const response = await resetClasscode(token, classroomId);
            console.log({ response });
            getThisClassroom();
        }).catch((error: string) => {
            console.error(error);
        });
    };
    
    const inviteUserToClassroomSubmit = (email: string) => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await inviteUserToClassroom(token, { email: email, classroomId: classroomId });
            console.log({ response });
            window.alert(`Invite successfully send to ${email}.`);
        }).catch((error: string) => {
            console.error(error);
        });
    };
    
    const inviteStudentSubmit = () => inviteUserToClassroomSubmit(inviteStudent.email);

    const inviteTeacherSubmit = () => inviteUserToClassroomSubmit(inviteTeacher.email);
    
    const deleteThisUserFromClassroom = (userId: string) => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await deleteUserFromClassroom(token, { userId: userId, classroomId: classroomId });
            console.log({ response });
            getThisClassroom();
        }).catch((error: string) => {
            console.error(error);
        });
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
            <div v-if="user.information.user" class="c-userelements">
                <UserElement name="Invite student" :add="true" @click="toggleInviteStudentPopup" />
                <UserElement v-for="(student, index) in classroom.users?.filter((user: any) => user.type === 0)" :key="index" :user="student" :classroom="classroom" :edit="studentsEdit" :userId="user.information.user!.uid" :deleteAction="deleteThisUserFromClassroom" />
            </div>
        </section>

        <section>
            <div class="u-flex u-align-center u-justify-space-between">
                <h2 class="u-weight-400">Teachers ({{ classroom.users?.filter((user: any) => user.type === 1).length }})</h2>
                <button class="c-button__soft u-color-x-light" @click="toggleTeachersEdit">{{ teachersEdit ? 'Done' : 'Edit' }}</button>
            </div>
            <div v-if="user.information.user" class="c-userelements">
                <UserElement name="Invite teacher" :add="true" @click="toggleInviteTeacherPopup" />
                <UserElement v-for="(teacher, index) in classroom.users?.filter((user: any) => user.type === 1)" :key="index" :user="teacher" :classroom="classroom" :edit="teachersEdit" :userId="user.information.user!.uid" :deleteAction="deleteThisUserFromClassroom" />
            </div>
        </section>
    </div>

    <Popup v-if="showClasscodePopup" title="Classroom information" :toggleClose="toggleShowClasscodePopup" buttonLabel="Reset classcode" :buttonAction="resetClasscodeSubmit">
        <p class="u-margin-0 u-margin-bottom-md u-size-32">{{ classroom?.classcode }}</p>
    </Popup>

    <Popup v-if="inviteStudentPopup" title="Invite student" :toggleClose="toggleInviteStudentPopup" buttonLabel="Invite student" :buttonAction="inviteStudentSubmit">
        <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="inviteStudent" modelName="email" />
    </Popup>

    <Popup v-if="inviteTeacherPopup" title="Invite teacher" :toggleClose="toggleInviteTeacherPopup" buttonLabel="Invite teacher" :buttonAction="inviteTeacherSubmit">
        <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="inviteTeacher" modelName="email" />
    </Popup>
</template>
