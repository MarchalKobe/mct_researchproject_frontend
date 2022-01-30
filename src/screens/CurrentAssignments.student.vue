<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive, ref } from 'vue';
    import Classroom from '../types/Classroom';
    import { getIdToken, User } from 'firebase/auth';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import Category from '../types/Category';
    import Assignment from '../types/Assignment';
    import AssignmentElement from '../components/AssignmentElement.vue';
    import router from '../bootstrap/router';
    import { useLoading } from '../store/loading';

    const { getClassroom, getCurrentCategoryByClassroom, getMyAssignmentsByCategory } = useNetwork();

    const { addLoading, removeLoading } = useLoading();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 2];

    const classroom = ref<Classroom | null>(null);

    const category = ref<Category | null>(null);

    const assignments = ref<Assignment[]>([]);

    const getThisClassroom = async () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getClassroom(token, classroomId);
            classroom.value = response.data.getClassroom;
            getThisCurrentCategoryByClassroom();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const getThisCurrentCategoryByClassroom = async () => {
        addLoading();
        
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getCurrentCategoryByClassroom(token, classroomId);
            category.value = response.data.getCurrentCategoryByClassroom;
            if(category.value) getThisMyAssignmentsByCategory();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const getThisMyAssignmentsByCategory = async () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getMyAssignmentsByCategory(token, category.value!.categoryId!);
            assignments.value = response.data.getMyAssignmentsByCategory;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const clickThisAssignmentAction = (scoreId: string) => {
        router.push(`/classes/${classroomId}/makeassignment/${scoreId}`);
    };

    getThisClassroom();
</script>

<template>
    <Navbar />

    <div v-if="classroom" class="e-container">
        <Header :title="`${classroom.name} - Current Assignments`" backPath="/classes" />

        <nav class="u-flex u-align-center u-justify-center u-margin-bottom-md">
            <RouterLink class="c-button__soft u-margin-right-x-lg" :class="pathNew[pathNew.length - 1] === 'currentassignments' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/currentassignments`">Current</RouterLink>
            <RouterLink class="c-button__soft" :class="pathNew[pathNew.length - 1] === 'finishedassignments' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/finishedassignments`">Finished</RouterLink>
        </nav>

        <div v-if="category">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">{{ category.name }}</h2>

            <div v-if="assignments && assignments.length" class="c-assignmentelements u-margin-bottom-lg">
                <AssignmentElement v-for="(assignment, index) in assignments" :key="index" class="c-assignmentelement" :assignment="assignment" :current="true" :clickAction="clickThisAssignmentAction"></AssignmentElement>
            </div>

            <p v-else>No assignments left, you can take a rest :)</p>
        </div>

        <p v-else>No assignments left, you can take a rest :)</p>
    </div>
</template>
