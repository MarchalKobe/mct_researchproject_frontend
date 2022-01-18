<script setup lang="ts">
    import { getIdToken, User } from 'firebase/auth';
    import { computed, reactive, ref } from 'vue';
    import router from '../bootstrap/router';
    import Navbar from '../components/Navbar.vue';
    import store from '../store';
    import { GetterTypes, UserState } from '../store/modules/user';
    import Level from '../types/Level';
    import { useNetwork } from '../utils/networkComposable';

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

    <div v-if="level && level.assignment" class="u-margin-left-navbar">
        <div class="u-margin-left-navbar-button">
            <h2 class="u-margin-0 u-weight-400">{{ level.assignment.category!.name }}</h2>
            <h3 class="u-margin-0 u-weight-400">Difficulty: {{ levels[level.level! - 1] }}</h3>
            <h1 class="u-margin-0 u-weight-400 u-margin-bottom-md">{{ level.assignment.subject }}</h1>
            <span>Description</span>
            <br />
            <textarea class="u-margin-bottom-md" style="width: 26rem; font-size: 1.5rem;" rows="3" v-model="level.description" />

            <div class="u-flex u-align-center">
                <button class="c-button__normal u-margin-right-sm" @click="cancelLevelSubmit">Go back</button>
                <button class="c-button__normal c-button__normal-orange u-margin-right-sm" @click="saveLevelSubmit">Save level</button>
                <button class="c-button__normal c-button__normal-green" @click="submitLevelSubmit">Submit level</button>
            </div>
        </div>
    </div>
</template>
