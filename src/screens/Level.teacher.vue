<script setup lang="ts">
    import { getIdToken, User } from 'firebase/auth';
    import { computed, reactive, ref } from 'vue';
    import router from '../bootstrap/router';
    import Navbar from '../components/Navbar.vue';
    import store from '../store';
    import { GetterTypes, UserState } from '../store/modules/user';
    import Level from '../types/Level';
    import { useNetwork } from '../utils/networkComposable';
import Textarea from '../components/Textarea.vue';

    const { getLevel, updateLevel } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 3];
    const levelId = pathNew[pathNew.length - 1];

    const level = ref<Level | null>();

    const getThisLevel = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getLevel(token, levelId);
            console.log({ response });
            level.value = response.data.getLevel;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const cancelLevelSubmit = () => {
        router.push(`/classes/${classroomId}/assignments`);
    };

    const saveLevelSubmit = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            level.value!.status = 1;
            const response = await updateLevel(token, level.value!);
            console.log({ response });
            router.push(`/classes/${classroomId}/assignments`);
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const submitLevelSubmit = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            level.value!.status = 2;
            const response = await updateLevel(token, level.value!);
            console.log({ response });
            router.push(`/classes/${classroomId}/assignments`);
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const levels = ref<string[]>(['Easy', 'Normal', 'Hard']);

    getThisLevel();
</script>

<template>
    <Navbar />

    <div v-if="level" class="c-level__container u-margin-left-navbar">
        <div class="c-level__information">
            <h2 class="c-level__category">{{ level.assignment!.category!.name }}</h2>
            <h1 class="c-level__subject"><span  :class="{ 'u-color-green': level.status === 2, 'u-color-orange': level.status === 1, 'u-color-red': level.status === 0 }">{{ levels[level.level! - 1] }}</span> - {{ level.assignment!.subject }}</h1>

            <Textarea label="Description" placeholder="Add a description for this assignment" :rows="3" :model="level" modelName="description" />

            <div class="u-flex u-align-center u-justify-end">
                <button class="c-button__normal u-margin-right-sm" @click="cancelLevelSubmit">Go back</button>
                <button class="c-button__normal c-button__normal-orange u-margin-right-sm" @click="saveLevelSubmit">Save level</button>
                <button class="c-button__normal c-button__normal-green" @click="submitLevelSubmit">Submit level</button>
            </div>
        </div>
        <div class="u-background-red">
            <span>2</span>
        </div>
        <div class="c-level__fullspan u-background-orange">
            <span>3</span>
        </div>
    </div>
</template>
