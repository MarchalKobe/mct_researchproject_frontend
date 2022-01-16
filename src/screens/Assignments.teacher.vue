<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive, ref, watch } from 'vue';
    import Classroom from '../types/Classroom';
    import { getIdToken, User } from 'firebase/auth';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';

    const { getClassroom } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const path = new URL(location.href).pathname;
    const pathNew = path.split('/');
    const classroomId = pathNew[pathNew.length - 2];

    const classroom = ref<Classroom | null>(null);

    const getThisClassroom = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getClassroom(token, classroomId);
            console.log({ response });
            classroom.value = response.data.getClassroom;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    getThisClassroom();





    const elements = reactive([
        {
            name: 'Element 1',
            position: 1,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            name: 'Element 1',
            position: 1,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            name: 'Element 2',
            position: 2,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            name: 'Element 2',
            position: 2,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            name: 'Element 3',
            position: 3,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            name: 'Element 3',
            position: 3,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            name: 'Element 4',
            position: 4,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            name: 'Element 4',
            position: 4,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            name: 'Element 5',
            position: 5,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            name: 'Element 5',
            position: 5,
            top: 'auto',
            left: 'auto',
            ref: undefined as HTMLElement | undefined,
        },
    ]);

    const edit = ref<boolean>(false);
    const toggleEdit = () => edit.value = !edit.value;

    const mouseX = ref<number>();
    const mouseY = ref<number>();
    const mouseXOffset = ref<number>();
    const mouseYOffset = ref<number>();

    window.addEventListener('mousemove', (event: MouseEvent) => {
        if(edit.value) {
            mouseX.value = event.clientX;
            mouseY.value = event.clientY;
        };
    });

    window.addEventListener('mouseup', () => {
        if(movingElement.value && edit.value) {
            elements.find((element) => element.ref === movingElement.value)!.top = 'auto';
            elements.find((element) => element.ref === movingElement.value)!.left = 'auto';

            movingElement.value = null;
        };

        clearInterval(myInterval.value);
    });

    const myInterval = ref<any>();
    const movingElement = ref<HTMLElement | null>(null);

    const setRef: any = (element: HTMLElement) => {
        if(element && element.dataset && element.dataset.index) {
            elements[parseInt(element.dataset.index)].ref = element;
    
            element.addEventListener('mousedown', () => {
                if(edit.value) {
                    movingElement.value = element;
    
                    mouseXOffset.value = (mouseX.value! - element.getBoundingClientRect().left) * 1;
                    mouseYOffset.value = (mouseY.value! - element.getBoundingClientRect().top) * 1;
                    
                    myInterval.value = setInterval(interval, 10);
                };
            });
        };
    };

    const interval = () => {
        if(movingElement.value && edit.value) {
            elements.find((element) => element.ref === movingElement.value)!.top = `${mouseY.value! - mouseYOffset.value!}px`;
            elements.find((element) => element.ref === movingElement.value)!.left = `${mouseX.value! - mouseXOffset.value!}px`;
        };
    };

    const logElements = () => {
        console.log({ elements });
    };
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
            <button class="c-button__normal" @click="logElements">Log elements</button>
            <button class="c-button__soft u-color-x-light" @click="toggleEdit">{{ edit ? 'Done' : 'Edit' }}</button>
        </div>


        <section class="c-test__container">
                <div :ref="element.type !== 'placeholder' ? setRef : null" v-for="(element, index) in elements" :key="index" :data-index="index" class="c-test" :class="element.type === 'placeholder' ? 'c-test__placeholder' : ''" :style="{ gridRow: `${element.position} / auto`, gridColumn: `1 / auto`, position: element.top !== 'auto' || element.left !== 'auto' ? 'absolute' : 'inherit', top: element.top, left: element.left }">
                    <div :style="{ opacity: element.type === 'placeholder' ? 0 : 1 }">
                        <span>{{ element.name }}</span>
                        <br />
                        <span>Category</span>
                        <br />
                        <span>Items</span>
                    </div>
                </div>
        </section>
    </div>
</template>
