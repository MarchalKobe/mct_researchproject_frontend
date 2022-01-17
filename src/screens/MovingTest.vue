<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, onUpdated, reactive, ref } from 'vue';
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

    const edit = ref<boolean>(false);
    const toggleEdit = () => edit.value = !edit.value;

    interface Element {
        name: string;
        content: string;
        position: number;
        selected?: boolean;
        top?: string;
        left?: string;
        width?: number;
        height?: number;
        xStart?: number;
        xEnd?: number;
        yStart?: number;
        yEnd?: number;
        ref?: HTMLElement;
    };

    const elements = reactive<Element[]>([
        {
            name: 'Element 1',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lacinia tempus ante, vitae aliquam tortor vehicula non. Donec eleifend eros sit amet ante luctus, sit amet iaculis massa tempus.',
            position: 2,
        },
        {
            name: 'Element 2',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lacinia tempus ante, vitae aliquam tortor vehicula non. Donec eleifend eros sit amet ante luctus, sit amet iaculis massa tempus. Sed pellentesque odio vitae vulputate aliquet. Etiam nunc quam, venenatis sit amet magna in, tincidunt fringilla ipsum. Donec eu nisi leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Interdum et malesuada fames ac ante ipsum primis in faucibus. In hac habitasse platea dictumst.',
            position: 1,
        },
        {
            name: 'Element 3',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lacinia tempus ante, vitae aliquam tortor vehicula non. Donec eleifend eros sit amet ante luctus, sit amet iaculis massa tempus.',
            position: 3,
        },
        {
            name: 'Element 4',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lacinia tempus ante, vitae aliquam tortor vehicula non. Donec eleifend eros sit amet ante luctus, sit amet iaculis massa tempus.',
            position: 4,
        },
    ]);

    interface Mouse {
        x: number;
        y: number;
        xOffset: number;
        yOffset: number;
        interval: number;
    }

    const mouse = reactive<Mouse>({
        x: 0,
        y: 0,
        xOffset: 0,
        yOffset: 0,
        interval: 0,
    });

    const setElementRef: any = (element: HTMLElement) => {
        if(element && element.dataset && element.dataset.index) {
            const el = elements[parseInt(element.dataset.index)];
            el.ref = element;
        };
    };

    const setCoordinates = () => {
        elements.map((element: Element) => {
            const rect = element.ref!.getBoundingClientRect();
            element.width = rect.width;
            element.height = rect.height;
            element.xStart = rect.left;
            element.xEnd = rect.left + rect.width;
            element.yStart = rect.top;
            element.yEnd = rect.top + rect.height;
        });
    };

    window.addEventListener('mousemove', (event: MouseEvent) => {
        if(edit.value) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;

            if(elements.find((element: Element) => element.selected)) {
                const thisElements = elements.filter((element: Element) => !element.selected);
                const selectedElement = elements.find((element: Element) => element.selected);

                selectedElement!.top = `${mouse.y - mouse.yOffset + document.documentElement.scrollTop}px`;
                selectedElement!.left = `${mouse.x - mouse.xOffset}px`;

                thisElements.map((element: Element) => {
                    if(event.clientX >= element.xStart!
                    && event.clientX <= element.xEnd!
                    && event.clientY >= element.yStart!
                    && event.clientY <= element.yEnd!) {
                        const position = element.position;

                        if(selectedElement!.position < element.position) {
                            elements.map((el: Element) => {
                                if(el.position <= element.position && el.position !== selectedElement!.position && el.position > selectedElement!.position) el.position--;
                            });
                        } else {
                            elements.map((el: Element) => {
                                if(el.position >= element.position && el.position !== selectedElement!.position && el.position < selectedElement!.position) el.position++;
                            });
                        };
                        
                        selectedElement!.position = position;
                    };
                });
            };
        };
    });

    window.addEventListener('mouseup', () => {
        const selectedElement = elements.find((element: Element) => element.selected);

        if(selectedElement) {
            selectedElement.selected = false;
            selectedElement.top = 'auto';
            selectedElement.left = 'auto';
            selectedElement.ref!.style.zIndex = '3';
            selectedElement.ref!.style.userSelect = 'inherit';
        };
    });

    let once = false;

    onUpdated(() => {
        setCoordinates();

        if(!once) {
            elements.map((element: Element) => {
                if(element.ref) {
                    element.selected = false;
                    element.top = 'auto';
                    element.left = 'auto';
    
                    element.ref.addEventListener('mousedown', () => {
                        if(edit.value) {
                            element.selected = true;
                            
                            element.ref!.style.zIndex = '1000';
                            element.ref!.style.userSelect = 'none';
                            
                            mouse.xOffset = (mouse.x - element.ref!.getBoundingClientRect().left) * 1;
                            mouse.yOffset = (mouse.y - element.ref!.getBoundingClientRect().top) * 1;
                            
                            element.top = `${mouse.y - mouse.yOffset + document.documentElement.scrollTop}px`;
                            element.left = `${mouse.x - mouse.xOffset}px`;
                        };
                    });
                };
            });

            once = true;
        };
    });

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
            <div v-for="(placeholder, index) in elements" :key="index" class="c-test__placeholder" :style="{ gridRow: `${placeholder.position} / auto`, gridColumn: `1 / auto`, width: `${placeholder.width}px`, height: `${placeholder.height}px` }"></div>

            <div :ref="setElementRef" v-for="(element, index) in elements" :key="index" :data-index="index" class="c-test__content" :class="edit ? 'c-test__moving' : ''" :style="{ gridRow: `${element.position} / auto`, gridColumn: `1 / auto`, top: element.top, left: element.left, position: element.selected ? 'absolute' : 'relative' }">
                <h2>{{ element.name }}</h2>
                <h3>Position: {{ element.position }}</h3>
                <p>{{ element.content }}</p>
            </div>
        </section>
    </div>
</template>
