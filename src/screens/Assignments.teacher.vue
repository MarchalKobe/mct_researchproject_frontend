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
            xStart: 0,
            xEnd: 0,
            yStart: 0,
            yEnd: 0,
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            position: 1,
        },
        {
            name: 'Element 2',
            position: 2,
            top: 'auto',
            left: 'auto',
            xStart: 0,
            xEnd: 0,
            yStart: 0,
            yEnd: 0,
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            position: 2,
        },
        {
            name: 'Element 3',
            position: 3,
            top: 'auto',
            left: 'auto',
            xStart: 0,
            xEnd: 0,
            yStart: 0,
            yEnd: 0,
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            position: 3,
        },
        {
            name: 'Element 4',
            position: 4,
            top: 'auto',
            left: 'auto',
            xStart: 0,
            xEnd: 0,
            yStart: 0,
            yEnd: 0,
            ref: undefined as HTMLElement | undefined,
        },
        {
            type: 'placeholder',
            position: 4,
        },
    ]);

    const edit = ref<boolean>(false);
    const toggleEdit = () => edit.value = !edit.value;

    const mouseX = ref<number>();
    const mouseY = ref<number>();
    const mouseXOffset = ref<number>();
    const mouseYOffset = ref<number>();

    const myInterval = ref<any>();
    const movingElement = ref<HTMLElement | null>(null);

    window.addEventListener('mousemove', (event: MouseEvent) => {
        if(edit.value) {
            mouseX.value = event.clientX;
            mouseY.value = event.clientY;

            if(movingElement.value) {
                const thisElements = elements.filter((element: any) => element.ref !== movingElement.value! && element.type !== 'placeholder');
                const selectedElement = elements.find((element: any) => element.ref === movingElement.value);

                thisElements.map((element: any) => {
                    if(event.clientX >= element.xStart
                    && event.clientX <= element.xEnd
                    && event.clientY >= element.yStart
                    && event.clientY <= element.yEnd) {
                        const position = element.position;

                        const elementPlaceholder = elements.find((el: any) => el.type === 'placeholder' && el.position === element.position) as any;
                        element!.position = selectedElement?.position;
                        elementPlaceholder!.position = selectedElement?.position;
                        
                        const placeholder = elements.find((el: any) => el.type === 'placeholder' && el.position === selectedElement!.position) as any;
                        selectedElement!.position = position;
                        placeholder!.position = position;
                    };
                });
            };
        };
    });

    window.addEventListener('mouseup', () => {
        if(movingElement.value && edit.value) {
            elements.find((element) => element.ref === movingElement.value)!.top = 'auto';
            elements.find((element) => element.ref === movingElement.value)!.left = 'auto';

            movingElement.value.style.zIndex = '2';
            movingElement.value.style.userSelect = 'inherit';

            movingElement.value = null;
        };

        clearInterval(myInterval.value);
    });

    const setRef: any = (element: HTMLElement) => {
        if(element && element.dataset && element.dataset.index) {
            const el = elements[parseInt(element.dataset.index)];
            el.ref = element;

            const rect = el.ref.getBoundingClientRect();
            el.xStart = rect.left;
            el.xEnd = rect.left + rect.width;
            el.yStart = rect.top;
            el.yEnd = rect.top + rect.height;
    
            element.addEventListener('mousedown', () => {
                if(edit.value) {
                    movingElement.value = element;

                    movingElement.value.style.zIndex = '1000';
                    movingElement.value.style.userSelect = 'none';
                    
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
            <div :ref="element.type !== 'placeholder' ? setRef : null" v-for="(element, index) in elements" :key="index" :data-index="index" class="c-test" :class="element.type === 'placeholder' ? 'c-test__placeholder' : ''" :style="{ gridRow: `${element.position} / auto`, gridColumn: `1 / auto`, position: element.type === 'placeholder' ? 'inherit' : (element.top !== 'auto' || element.left !== 'auto' ? 'absolute' : 'inherit'), top: element.type === 'placeholder' ? 'auto' : element.top, left: element.type === 'placeholder' ? 'auto' : element.left }">
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
