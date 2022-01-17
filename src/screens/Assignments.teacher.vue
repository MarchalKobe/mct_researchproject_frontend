<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive, ref, watch } from 'vue';
    import Classroom from '../types/Classroom';
    import { getIdToken, User } from 'firebase/auth';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import Popup from '../components/Popup.vue';
    import Category from '../types/Category';
    import Input from '../components/Input.vue';
    import CategoryOption from '../types/CategoryOption';
    import SelectOption from '../types/SelectOption';
    import Select from '../components/Select.vue';

    const { getClassroom, getCategory, getCategoriesByClassroom, addCategory } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 2];

    const classroom = ref<Classroom | null>(null);

    const newCategory = reactive<Category>({
        name: '',
    });

    const categoryOptions = ref<SelectOption[]>([]);
    const selectedCategory = reactive<CategoryOption>({
        categoryId: '',
    });

    const category = ref<Category>();

    const edit = ref<boolean>(false);
    const toggleEdit = () => edit.value = !edit.value;

    const addCategoryPopup = ref<boolean>(false);
    const toggleAddCategoryPopup = () => addCategoryPopup.value = !addCategoryPopup.value;

    const getThisClassroom = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getClassroom(token, classroomId);
            console.log({ response });
            classroom.value = response.data.getClassroom;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const getThisCategory = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getCategory(token, selectedCategory.categoryId);
            console.log({ response });
            category.value = response.data.getCategory;
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

    const addCategorySubmit = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await addCategory(token, { name: newCategory.name, classroomId: classroomId });
            console.log({ response });
            getThisCategoriesByClassroom();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    watch(() => selectedCategory.categoryId, () => {
        getThisCategory();
    });

    getThisClassroom();
    getThisCategoriesByClassroom();
</script>

<template>
    <Navbar />

    <div v-if="classroom" class="e-container">
        <Header :title="`${classroom.name} - Assignments`" backPath="/classes" />

        <nav class="u-flex u-align-center u-justify-center u-margin-bottom-md">
            <RouterLink class="c-button__soft u-margin-right-x-lg" :class="pathNew[pathNew.length - 1] === 'assignments' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/assignments`">Assignments</RouterLink>
            <RouterLink class="c-button__soft" :class="pathNew[pathNew.length - 1] === 'members' ? 'c-button__soft-selected' : ''" :to="`/classes/${classroomId}/members`">Members</RouterLink>
        </nav>

        <div class="u-flex u-align-center u-justify-space-between u-margin-bottom-lg">
            <button class="c-button__normal" @click="toggleAddCategoryPopup">Create category</button>
            <Select class="u-width-14" description="Select category" :model="selectedCategory" modelName="categoryId" :options="categoryOptions" />
        </div>

        <div v-if="category" class="u-flex u-align-center u-justify-space-between u-margin-bottom-lg">
            <div class="u-flex u-align-center">
                <h2 class="u-margin-0 u-weight-400 u-margin-right-lg">{{ category.name }}</h2>
                <button v-if="edit" class="c-button__icon c-button__icon-orange u-margin-right-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                </button>
                <button v-if="edit" class="c-button__icon c-button__icon-alpha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
            <span v-if="edit" class="u-color-orange">Hold the assignments to move them in order</span>
            <button class="c-button__soft u-color-x-light" @click="toggleEdit">{{ edit ? 'Done' : 'Edit' }}</button>
        </div>
        <div v-else>
            <p>No category selected</p>
        </div>
    </div>

    <Popup v-if="addCategoryPopup" title="Create category" :toggleClose="toggleAddCategoryPopup" buttonLabel="Create category" :buttonAction="addCategorySubmit">
        <Input label="Name" symbol="category" type="text" placeholder="Fundamentals" :model="newCategory" modelName="name" />
    </Popup>
</template>
