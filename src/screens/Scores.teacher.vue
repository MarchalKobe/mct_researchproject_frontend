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
    import AssignmentElement from '../components/AssignmentElement.vue';
    import Assignment from '../types/Assignment';
    import ProgressBar from '../components/ProgressBar.vue';
    import Level from '../types/Level';
    import Score from '../types/Score';

    const { getUser, getClassroom, getCategoriesByClassroom, getUserScoresByCategory } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 3];
    const userId = pathNew[pathNew.length - 1];

    const classroom = ref<Classroom | null>(null);

    const categoryOptions = ref<SelectOption[]>([]);
    const selectedCategory = reactive<CategoryOption>({
        categoryId: '',
    });

    const thisUser = ref<UserState | null>(null);

    const assignments = ref<Assignment[]>([]);

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

            getThisUser();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const getThisUser = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getUser(token, userId);
            console.log({ response });
            thisUser.value = response.data.getUser;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const getThisUserScoresByCategory = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getUserScoresByCategory(token, userId, selectedCategory.categoryId);
            console.log({ response })
            assignments.value = response.data.getUserScoresByCategory;

            assignments.value.map((assignment: Assignment) => {
                let scores: number[] = [];

                assignment.levels?.map((level: Level) => {
                    level.scores?.map((score: Score) => {
                        scores.push(JSON.parse(score.scores!).total);
                    });
                });

                assignment.total = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
            });
        }).catch((error: string) => {
            console.error(error);
        });
    };

    getThisClassroom();

    watch(() => selectedCategory.categoryId, () => {
        getThisUserScoresByCategory();
    });

    const levels = ref<string[]>(['Easy', 'Normal', 'Hard']);
</script>

<template>
    <Navbar />

    <div v-if="classroom && thisUser" class="e-container">
        <Header :title="`${thisUser.firstName} ${thisUser.lastName} - Scores`" :backPath="`/classes/${classroomId}/members`" />

        <div class="u-flex u-align-center u-justify-space-between u-wrap u-margin-bottom-md">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">Scores</h2>
            <Select class="u-margin-bottom-md u-width-14" :description="categoryOptions.length ? 'Select category' : 'No categories found'" :model="selectedCategory" modelName="categoryId" :options="categoryOptions" />
        </div>

        <div v-if="selectedCategory.categoryId" class="u-margin-bottom-lg">
            <div v-if="assignments && assignments.length" class="c-assignmentelements">
                <AssignmentElement v-for="(assignment, index) in assignments" :key="index" class="c-assignmentelement" :assignment="assignment" :showScore="true" openLabel="Scores">
                    <div v-for="(level, index) in assignment.levels" :key="index" class="u-margin-bottom-lg">
                        <p class="u-margin-0 u-margin-bottom-sm u-size-20">{{ levels[level.level! - 1] }}</p>
                        <div v-for="(score, index) in level.scores" :key="index" class="u-margin-bottom-md">
                            <p class="u-margin-0 u-size-20 u-color-x-light">Total: <span class="u-color-xx-light">{{ JSON.parse(score.scores!).total }}%</span></p>
                            <p class="u-margin-0 u-margin-bottom-sm u-color-x-light">(Tags: {{ JSON.parse(score.scores!).tags }}% - Attributes: {{ JSON.parse(score.scores!).attributes }}% - Text: {{ JSON.parse(score.scores!).text }}%)</p>
                            <ProgressBar style="width: 24rem" :progress="JSON.parse(score.scores!).total" />
                        </div>
                    </div>
                </AssignmentElement>
            </div>
    
            <p v-else>No scores found.</p>
        </div>

        <p v-else>No category selected.</p>
    </div>
</template>
