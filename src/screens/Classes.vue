<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import BigItem from '../components/BigItem.vue';
    import { computed, reactive, ref } from 'vue';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import { getIdToken, User } from 'firebase/auth';

    const { addClassroom, joinClassroom } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const edit = ref<boolean>(false);
    const toggleEdit = () => edit.value = !edit.value;

    const addClassPopup = ref<boolean>(false);
    const classname = ref<string>('');
    const toggleAddClassPopup = () => addClassPopup.value = !addClassPopup.value;

    const joinClassPopup = ref<boolean>(false);
    const classcode = ref<string>('');
    const toggleJoinClassPopup = () => joinClassPopup.value = !joinClassPopup.value;

    const addClassroomSubmit = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await addClassroom(token, { name: classname.value });
            console.log({ response });
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const joinClassroomSubmit = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await joinClassroom(token, { classcode: classcode.value });
            console.log({ response });
        }).catch((error: string) => {
            console.error(error);
        });
    };
</script>

<template>
    <Navbar />

    <div class="e-container">
        <Header title="Classes" />

        <section>
            <div class="u-flex u-align-center u-justify-end u-margin-bottom-lg">
                <button class="c-button__soft u-color-x-light" @click="toggleEdit">{{ edit ? 'Done' : 'Edit' }}</button>
            </div>
            
            <div class="c-bigitem__container">
                <BigItem v-if="user.information.type === 1" :add="true" name="Create class" @click="toggleAddClassPopup" />
                <BigItem :add="true" name="Join class" @click="toggleJoinClassPopup" />
                <BigItem :edit="edit" name="4BOIN" />
            </div>
        </section>
    </div>

    <div v-if="addClassPopup" @click.self="toggleAddClassPopup" class="c-popup__container">
        <div class="c-popup">
            <button class="c-popup__button c-button__icon c-button__icon-alpha" @click="toggleAddClassPopup">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h1 class="c-popup__title">Create class</h1>

            <form @submit.prevent>
                <label class="c-input__container u-margin-bottom-md" for="classname">
                    <span class="c-input__label">Name</span>
                    <div class="c-input">
                        <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 50 37">
                            <path id="icons8-class" d="M2.813,8A1,1,0,0,0,2,9V38H.906A1,1,0,0,0,0,39v5a1,1,0,0,0,1,1H49a1,1,0,0,0,1-1V39a1,1,0,0,0-1-1H48V9a1,1,0,0,0-1-1H2.813ZM4,10H46V38H21.906L23,36l-1.094-2H11v4H4Zm35,4.969a1.536,1.536,0,0,0-.594.219L25.031,24.719l-5.406-4.5a1,1,0,0,0-1.219-.031l-8,6a1.006,1.006,0,0,0,1.188,1.625l7.375-5.531,5.406,4.5a1,1,0,0,0,1.219.031l14-10A1,1,0,0,0,39,14.969ZM2,40H48v3H2Z" fill="#A2A8B0"/>
                        </svg>
                        <input class="c-input__field" type="text" name="classname" id="classname" placeholder="4BOIN" v-model="classname">
                    </div>
                </label>
    
                <div class="u-flex u-align-center u-justify-end">
                    <button class="c-button__normal c-button__normal-alpha" @click="addClassroomSubmit">Create class</button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="joinClassPopup" @click.self="toggleJoinClassPopup" class="c-popup__container">
        <div class="c-popup">
            <button class="c-popup__button c-button__icon c-button__icon-alpha" @click="toggleJoinClassPopup">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h1 class="c-popup__title">Join class</h1>

            <form @submit.prevent>
                <label class="c-input__container u-margin-bottom-md" for="classcode">
                    <span class="c-input__label">Class code</span>
                    <div class="c-input">
                        <svg class="c-input__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 50 37">
                            <path id="icons8-class" d="M2.813,8A1,1,0,0,0,2,9V38H.906A1,1,0,0,0,0,39v5a1,1,0,0,0,1,1H49a1,1,0,0,0,1-1V39a1,1,0,0,0-1-1H48V9a1,1,0,0,0-1-1H2.813ZM4,10H46V38H21.906L23,36l-1.094-2H11v4H4Zm35,4.969a1.536,1.536,0,0,0-.594.219L25.031,24.719l-5.406-4.5a1,1,0,0,0-1.219-.031l-8,6a1.006,1.006,0,0,0,1.188,1.625l7.375-5.531,5.406,4.5a1,1,0,0,0,1.219.031l14-10A1,1,0,0,0,39,14.969ZM2,40H48v3H2Z" fill="#A2A8B0"/>
                        </svg>
                        <input class="c-input__field" type="text" name="classcode" id="classcode" placeholder="1234" v-model="classcode">
                    </div>
                </label>
    
                <div class="u-flex u-align-center u-justify-end">
                    <button class="c-button__normal c-button__normal-alpha" @click="joinClassroomSubmit">Join class</button>
                </div>
            </form>
        </div>
    </div>
</template>
