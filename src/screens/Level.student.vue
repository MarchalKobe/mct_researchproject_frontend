<script setup lang="ts">
    import { getIdToken, User } from 'firebase/auth';
    import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
    import router from '../bootstrap/router';
    import Navbar from '../components/Navbar.vue';
    import store from '../store';
    import { GetterTypes, UserState } from '../store/modules/user';
    import { useNetwork } from '../utils/networkComposable';
    import Editor from '../components/Editor.vue';
    import EditorNavigation from '../types/EditorNavigation';
    import LivePreview from '../components/LivePreview.vue';
    import Score from '../types/Score';
    import { useLoading } from '../store/loading';

    const { getScore, updateScore } = useNetwork();

    const { addLoading, removeLoading } = useLoading();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 3];
    const scoreId = pathNew[pathNew.length - 1];

    const score = ref<Score | null>();

    const editorNavigation = reactive<EditorNavigation>({
        tab: 'code',
        language: 'html',
    });

    const getThisScore = async () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getScore(token, scoreId);

            response.data.getScore.code = JSON.parse(response.data.getScore.code);
            response.data.getScore.level.code = JSON.parse(response.data.getScore.level.code);
            response.data.getScore.level.startcode = JSON.parse(response.data.getScore.level.startcode);

            score.value = response.data.getScore;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const cancelScoreSubmit = () => {
        if(!window.confirm('Are your sure you want to cancel this assignment? All progress will be lost.')) return;

        router.push(`/classes/${classroomId}/currentassignments`);
    };

    const submitScoreSubmit = () => {
        if(!window.confirm('Are your sure you want to submit this assignment?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            score.value!.status = 1;
            const response = await updateScore(token, score.value!);
            router.push(`/classes/${classroomId}/currentassignments`);
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const levels = ref<string[]>(['Easy', 'Normal', 'Hard']);

    getThisScore();
    
    const width = ref<number>(window.innerWidth);
    const getWidth = () => width.value = window.innerWidth;
    onMounted(() => window.addEventListener('resize', getWidth));
    onUnmounted(() => window.removeEventListener('resize', getWidth));
</script>

<template>
    <Navbar />

    <div v-if="width >= 880 && score" class="c-level__container u-margin-left-navbar">
        <div class="c-level__information">
            <h2 class="c-level__category">{{ score.level!.assignment!.category!.name }}</h2>
            <h1 class="c-level__subject"><span class="u-color-x-light">{{ levels[score.level!.level! - 1] }} -</span> {{ score.level!.assignment!.subject }}</h1>

            <p>{{ score.level!.description }}</p>

            <div class="u-flex u-align-center u-justify-end">
                <button class="c-button__normal u-margin-right-sm" @click="cancelScoreSubmit">Cancel</button>
                <button class="c-button__normal c-button__normal-green" @click="submitScoreSubmit">Submit assignment</button>
            </div>
        </div>
        <div>
            <Editor :student="true" :code="score.code" :editorNavigation="editorNavigation" :user="user.information" />
        </div>
        <div class="c-level__fullspan">
            <div class="u-flex u-direction-column" style="height: calc(100% - 5rem)">
                <LivePreview label="Assignment" :code="score.level!.code!.html" />
                <LivePreview label="Your code" :code="score.code!.html!" />
            </div>
        </div>
    </div>

    <p v-if="width < 880" class="u-margin-left-navbar">Use a full sized web browser to make assignments.</p>
</template>
