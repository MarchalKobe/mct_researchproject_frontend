<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import ClassElement from '../components/ClassElement.vue';
    import { computed, reactive, ref } from 'vue';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import { getIdToken, User } from 'firebase/auth';
    import Classroom from '../types/Classroom';
    import router from '../bootstrap/router';
    import Input from '../components/Input.vue';
    import Popup from '../components/Popup.vue';
    import UpdateClassroomInput from '../types/UpdateClassroomInput';
    import DupplicateClassroomInput from '../types/DupplicateClassroomInput';
    import { useLoading } from '../store/loading';

    const { getMyJoinedClassrooms, addClassroom, updateClassroom, dupplicateClassroom, closeClassroom, joinClassroom, leaveClassroom } = useNetwork();

    const { addLoading, removeLoading } = useLoading();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const edit = ref<boolean>(false);
    const toggleEdit = () => edit.value = !edit.value;

    const classrooms = ref<Classroom[]>([]);

    const classroom = reactive<Classroom>({
        name: '',
        classcode: '',
    });

    const updateClass = reactive<Classroom>({
        classroomId: '',
        name: '',
    });

    const dupplicateClass = reactive<Classroom>({
        classroomId: '',
        name: '',
    });

    const addClassPopup = ref<boolean>(false);
    const toggleAddClassPopup = () => addClassPopup.value = !addClassPopup.value;

    const updateClassPopup = ref<boolean>(false);
    const toggleUpdateClassPopup = (classr: Classroom | null = null) => {
        if(classr) {
            updateClass.classroomId = classr.classroomId;
            updateClass.name = classr.name;
        };

        updateClassPopup.value = !updateClassPopup.value;
    };

    const joinClassPopup = ref<boolean>(false);
    const toggleJoinClassPopup = () => joinClassPopup.value = !joinClassPopup.value;

    const dupplicateClassPopup = ref<boolean>(false);
    const toggleDupplicateClassPopup = (classr: Classroom | null = null) => {
        if(classr) {
            dupplicateClass.classroomId = classr.classroomId;
            dupplicateClass.name = classr.name;
        };

        dupplicateClassPopup.value = !dupplicateClassPopup.value;
    };

    const getThisMyJoinedClassrooms = async () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getMyJoinedClassrooms(token);
            classrooms.value = response.data.getMyJoinedClassrooms;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const addClassroomSubmit = async () => {
        if(!window.confirm('Are your sure you want to create this classroom?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await addClassroom(token, { name: classroom.name! });
            getThisMyJoinedClassrooms();
            toggleAddClassPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const updateClassroomSubmit = async () => {
        if(!window.confirm('Are your sure you want to update this classroom?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateClassroom(token, updateClass as UpdateClassroomInput);
            getThisMyJoinedClassrooms();
            toggleUpdateClassPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const joinClassroomSubmit = async () => {
        if(!window.confirm('Are your sure you want to join this classroom?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await joinClassroom(token, { classcode: classroom.classcode! });
            getThisMyJoinedClassrooms();
            toggleJoinClassPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const leaveThisClassroom = async (classroomId: string) => {
        if(!window.confirm('Are your sure you want to leave this classroom?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await leaveClassroom(token, classroomId);
            getThisMyJoinedClassrooms();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const dupplicateClassroomSubmit = async () => {
        if(!window.confirm('Are your sure you want to dupplicate this classroom?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await dupplicateClassroom(token, dupplicateClass as DupplicateClassroomInput);
            getThisMyJoinedClassrooms();
            toggleDupplicateClassPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const closeThisClassroom = async (classroomId: string) => {
        if(!window.confirm('Are your sure you want to close this classroom? This action can\'t be undone.')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await closeClassroom(token, classroomId);
            getThisMyJoinedClassrooms();
            edit.value = false;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const goToClass = (classroomId: string) => {
        switch(user.information.type) {
            case 0:
                router.push(`/classes/${classroomId}/currentassignments`);
                break;
            case 1:
                router.push(`/classes/${classroomId}/assignments`);
                break;
        };
    };

    getThisMyJoinedClassrooms();
</script>

<template>
    <Navbar />

    <div class="e-container">
        <Header title="Classes" />

        <section>
            <div class="u-flex u-align-center u-justify-end u-margin-bottom-lg">
                <button class="c-button__soft u-color-x-light" @click="toggleEdit">{{ edit ? 'Done' : 'Edit' }}</button>
            </div>
            
            <div v-if="user.information.user" class="c-classelements">
                <ClassElement v-if="user.information.type === 1" :add="true" name="Create class" @click="toggleAddClassPopup" />
                <ClassElement :add="true" name="Join class" @click="toggleJoinClassPopup" />
                <ClassElement v-for="(classroom, index) in classrooms" :key="index" :classroom="classroom" :edit="edit" :user="user.information" :leaveAction="leaveThisClassroom" :updateAction="toggleUpdateClassPopup" :closeAction="closeThisClassroom" :dupplicateAction="toggleDupplicateClassPopup" :clickAction="goToClass" />
            </div>
        </section>
    </div>

    <Popup v-if="addClassPopup" title="Create class" :toggleClose="toggleAddClassPopup" buttonLabel="Create class" :buttonAction="addClassroomSubmit">
        <Input label="Name" symbol="classroom" type="text" placeholder="4BOIN" :model="classroom" modelName="name" />
    </Popup>

    <Popup v-if="updateClassPopup" title="Update class" :toggleClose="toggleUpdateClassPopup" buttonLabel="Update class" :buttonAction="updateClassroomSubmit">
        <Input label="Name" symbol="classroom" type="text" placeholder="4BOIN" :model="updateClass" modelName="name" />
    </Popup>

    <Popup v-if="joinClassPopup" title="Join class" :toggleClose="toggleJoinClassPopup" buttonLabel="Join class" :buttonAction="joinClassroomSubmit">
        <Input label="Class code" symbol="classroom" type="text" placeholder="1234" :model="classroom" modelName="classcode" />
    </Popup>

    <Popup v-if="dupplicateClassPopup" title="Dupplicate class" :toggleClose="toggleDupplicateClassPopup" buttonLabel="Dupplicate class" :buttonAction="dupplicateClassroomSubmit">
        <Input label="Name" symbol="classroom" type="text" placeholder="4BOIN" :model="dupplicateClass" modelName="name" />
    </Popup>
</template>
