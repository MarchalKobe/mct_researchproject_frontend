<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive, ref, watch } from 'vue';
    import Classroom from '../types/Classroom';
    import { getIdToken, User } from 'firebase/auth';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import SelectOption from '../types/SelectOption';
    import Category from '../types/Category';
    import CategoryOption from '../types/CategoryOption';
    import Select from '../components/Select.vue';
    import Score from '../types/Score';
import AssignmentElement from '../components/AssignmentElement.vue';

    const { getClassroom, getCategoriesByClassroom, getMyScoresByCategory } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 2];

    const classroom = ref<Classroom | null>(null);

    const categoryOptions = ref<SelectOption[]>([]);
    const selectedCategory = reactive<CategoryOption>({
        categoryId: '',
    });

    const scores = ref<Score[]>([]);

    const getThisClassroom = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getClassroom(token, classroomId);
            console.log({ response });
            classroom.value = response.data.getClassroom;
            getThisCategoriesByClassroom();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const getThisCategoriesByClassroom = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getCategoriesByClassroom(token, classroomId);
            console.log({ response });

            let options: SelectOption[] = [];

            response.data.getCategoriesByClassroom.map((cat: Category) => {
                options.push({
                    id: cat.categoryId!,
                    value: cat.name,
                });
            });

            categoryOptions.value = options;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const getThisScoresByCategory = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getMyScoresByCategory(token, selectedCategory.categoryId);
            console.log({ response })
            scores.value = response.data.getMyScoresByCategory;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const clickThisScoreAction = () => {
        console.log('clicked');
    };

    getThisClassroom();

    watch(() => selectedCategory.categoryId, () => {
        getThisScoresByCategory();
    });
</script>

<template>
    <Navbar />

    <div v-if="classroom" class="e-container">
        <Header :title="`${classroom.name} - Finished Assignments`" backPath="/classes" />

        <nav class="u-flex u-align-center u-justify-center u-margin-bottom-md">
            <RouterLink class="c-button__soft u-margin-right-x-lg" :class="pathNew[pathNew.length - 1] === 'currentassignments' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/currentassignments`">Current</RouterLink>
            <RouterLink class="c-button__soft" :class="pathNew[pathNew.length - 1] === 'finishedassignments' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/finishedassignments`">Finished</RouterLink>
        </nav>

        <div class="u-flex u-align-center u-justify-space-between u-margin-bottom-lg">
            <h2 class="u-margin-0 u-weight-400">Finished assignments</h2>
            <Select class="u-width-14" :description="categoryOptions.length ? 'Select category' : 'No categories found'" :model="selectedCategory" modelName="categoryId" :options="categoryOptions" />
        </div>

        <div v-if="selectedCategory.categoryId">
            <div v-if="scores && scores.length" class="c-assignmentelements">
                <AssignmentElement v-for="(score, index) in scores" :key="index" class="c-assignmentelement" :assignment="score.level!.assignment" :clickAction="clickThisScoreAction"></AssignmentElement>
            </div>
    
            <p v-else>No scores found.</p>
        </div>

        <p v-else>No category selected.</p>
    </div>
</template>
