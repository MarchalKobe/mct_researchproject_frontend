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

    const { getMyJoinedClassrooms, addClassroom, joinClassroom, leaveClassroom } = useNetwork();

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

    const addClassPopup = ref<boolean>(false);
    const toggleAddClassPopup = () => addClassPopup.value = !addClassPopup.value;

    const joinClassPopup = ref<boolean>(false);
    const toggleJoinClassPopup = () => joinClassPopup.value = !joinClassPopup.value;

    const getThisMyJoinedClassrooms = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getMyJoinedClassrooms(token);
            console.log({ response });
            classrooms.value = response.data.getMyJoinedClassrooms;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const addClassroomSubmit = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await addClassroom(token, { name: classroom.name! });
            console.log({ response });
            getThisMyJoinedClassrooms();
            toggleAddClassPopup();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const joinClassroomSubmit = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await joinClassroom(token, { classcode: classroom.classcode! });
            console.log({ response });
            getThisMyJoinedClassrooms();
            toggleJoinClassPopup();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const leaveThisClassroom = async (classroomId: string) => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await leaveClassroom(token, classroomId);
            console.log({ response });
            getThisMyJoinedClassrooms();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const deleteThisClassroom = async (classroomId: string) => {
        console.log({classroomId});
        
        getIdToken(user.information.user as User).then(async (token: string) => {
            // TODO: delete classroom
            getThisMyJoinedClassrooms();
        }).catch((error: string) => {
            console.error(error);
        });
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

    const html = ref<string>(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Title</title>
            </head>
            <body>
                <h1>Title</h1>
                <h2>Subtitle</h2>
                <p>Dit is een paragraaf</p>
            </body>
        </html>
    `);
</script>

<template>
    <Navbar />

    <div class="e-container">
        <!-- <iframe :srcdoc="html" frameborder="0" style="background: white; width: 100%; height: 300px;"></iframe> -->

        <Header title="Classes" />

        <section>
            <div class="u-flex u-align-center u-justify-end u-margin-bottom-lg">
                <button class="c-button__soft u-color-x-light" @click="toggleEdit">{{ edit ? 'Done' : 'Edit' }}</button>
            </div>
            
            <div v-if="user.information.user" class="c-classelements">
                <ClassElement v-if="user.information.type === 1" :add="true" name="Create class" @click="toggleAddClassPopup" />
                <ClassElement :add="true" name="Join class" @click="toggleJoinClassPopup" />
                <ClassElement v-for="(classroom, index) in classrooms" :key="index" :classroom="classroom" :edit="edit" :userId="user.information.user.uid" :leaveAction="leaveThisClassroom" :deleteAction="deleteThisClassroom" :clickAction="goToClass" />
            </div>
        </section>
    </div>

    <Popup v-if="addClassPopup" title="Create class" :toggleClose="toggleAddClassPopup" buttonLabel="Create class" :buttonAction="addClassroomSubmit">
        <Input label="Name" symbol="classroom" type="text" placeholder="4BOIN" :model="classroom" modelName="name" />
    </Popup>

    <Popup v-if="joinClassPopup" title="Join class" :toggleClose="toggleJoinClassPopup" buttonLabel="Join class" :buttonAction="joinClassroomSubmit">
        <Input label="Class code" symbol="classroom" type="text" placeholder="1234" :model="classroom" modelName="classcode" />
    </Popup>
</template>
