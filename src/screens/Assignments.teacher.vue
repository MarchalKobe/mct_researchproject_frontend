<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, onUpdated, reactive, ref, watch } from 'vue';
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
    import AssignmentElement from '../components/AssignmentElement.vue';
    import Assignment from '../types/Assignment';
    import Mouse from '../types/Mouse';

    const { getClassroom, getCategory, getCategoriesByClassroom, addCategory, updateCategory, getAssignmentsByCategory, addAssignment, updateAssignment } = useNetwork();

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

    const addThisCategory = reactive<Category>({
        name: '',
    });

    const updateThisCategory = reactive<Category>({
        name: '',
    });

    const addThisAssignment = reactive<Assignment>({
        subject: '',
    });

    const updateThisAssignment = reactive<Assignment>({
        assignmentId: '',
        subject: '',
    });

    const category = ref<Category>();

    const assignments = ref<Assignment[]>([]);

    const edit = ref<boolean>(false);
    const toggleEdit = () => {
        edit.value = !edit.value;

        if(!edit.value) {

        };
    };

    const addCategoryPopup = ref<boolean>(false);
    const toggleAddCategoryPopup = () => addCategoryPopup.value = !addCategoryPopup.value;

    const updateCategoryPopup = ref<boolean>(false);
    const toggleUpdateCategoryPopup = () => updateCategoryPopup.value = !updateCategoryPopup.value;

    const addAssignmentPopup = ref<boolean>(false);
    const toggleAddAssignmentPopup = () => addAssignmentPopup.value = !addAssignmentPopup.value;

    const updateAssignmentPopup = ref<boolean>(false);
    const toggleUpdateAssignmentPopup = () => updateAssignmentPopup.value = !updateAssignmentPopup.value;

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
            updateThisCategory.name = category.value!.name;
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const getThisAssignmentsByCategory = async () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getAssignmentsByCategory(token, selectedCategory.categoryId);
            console.log({ response });
            assignments.value = response.data.getAssignmentsByCategory;
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
            const response = await addCategory(token, { name: addThisCategory.name, classroomId: classroomId });
            console.log({ response });
            getThisCategoriesByClassroom();
            toggleAddCategoryPopup();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const updateCategorySubmit = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateCategory(token, { categoryId: selectedCategory.categoryId, name: updateThisCategory.name });
            console.log({ response });
            getThisCategoriesByClassroom();
            getThisCategory();
            toggleUpdateCategoryPopup();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const addAssignmentSubmit = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await addAssignment(token, { subject: addThisAssignment.subject, categoryId: selectedCategory.categoryId });
            console.log({ response });
            getThisAssignmentsByCategory();
            toggleAddAssignmentPopup();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const updateAssignmentSubmit = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateAssignment(token, { assignmentId: updateThisAssignment.assignmentId!, subject: updateThisAssignment.subject });
            console.log({ response });
            getThisAssignmentsByCategory();
            toggleUpdateAssignmentPopup();
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const updateThisAssignmentAction = (assignmentId: string) => {
        console.log('Update assignment', assignmentId);
        updateThisAssignment.assignmentId = assignmentId;
        updateThisAssignment.subject = assignments.value.find((assignment: Assignment) => assignment.assignmentId === assignmentId)!.subject;
        toggleUpdateAssignmentPopup();
    };

    const deleteThisAssignemntAction = (assignmentId: string) => {
        console.log('Delete assignment', assignmentId);
    };
    
    watch(() => selectedCategory.categoryId, () => {
        getThisCategory();
        getThisAssignmentsByCategory();
    });

    getThisClassroom();
    getThisCategoriesByClassroom();

    const mouse = reactive<Mouse>({
        x: 0,
        y: 0,
        xOffset: 0,
        yOffset: 0,
        interval: 0,
    });

    const setElementRef: any = (element: HTMLElement) => {
        if(element && element.dataset && element.dataset.index) {
            const el = assignments.value[parseInt(element.dataset.index)];
            el.ref = element;
        };
    };

    const setCoordinates = () => {
        assignments.value.map((assignment: Assignment) => {
            const rect = assignment.ref!.getBoundingClientRect();
            assignment.width = rect.width;
            assignment.height = rect.height;
            assignment.xStart = rect.left;
            assignment.xEnd = rect.left + rect.width;
            assignment.yStart = rect.top;
            assignment.yEnd = rect.top + rect.height;
        });
    };

    window.addEventListener('mousemove', (event: MouseEvent) => {
        if(edit.value) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;

            if(assignments.value.find((assignment: Assignment) => assignment.selected)) {
                const thisAssignments = assignments.value.filter((assignment: Assignment) => !assignment.selected);
                const selectedAssignment = assignments.value.find((assignment: Assignment) => assignment.selected);

                selectedAssignment!.top = `${mouse.y - mouse.yOffset + document.documentElement.scrollTop}px`;
                selectedAssignment!.left = `${mouse.x - mouse.xOffset}px`;

                thisAssignments.map((assignment: Assignment) => {
                    if(event.clientX >= assignment.xStart!
                    && event.clientX <= assignment.xEnd!
                    && event.clientY >= assignment.yStart!
                    && event.clientY <= assignment.yEnd!) {
                        const position = assignment.position;

                        if(selectedAssignment!.position! < assignment.position!) {
                            assignments.value.map((as: Assignment) => {
                                if(as.position! <= assignment.position! && as.position !== selectedAssignment!.position && as.position! > selectedAssignment!.position!) as.position!--;
                            });
                        } else {
                            assignments.value.map((as: Assignment) => {
                                if(as.position! >= assignment.position! && as.position !== selectedAssignment!.position && as.position! < selectedAssignment!.position!) as.position!++;
                            });
                        };
                        
                        selectedAssignment!.position = position;
                    };
                });
            };
        };
    });

    window.addEventListener('mouseup', () => {
        const selectedAssignment = assignments.value.find((assignment: Assignment) => assignment.selected);

        if(selectedAssignment) {
            selectedAssignment.selected = false;
            selectedAssignment.top = 'auto';
            selectedAssignment.left = 'auto';
            selectedAssignment.ref!.style.zIndex = '3';
            selectedAssignment.ref!.style.userSelect = 'inherit';
        };
    });

    let once = false;

    onUpdated(() => {
        if(assignments.value.length) {
            setCoordinates();
    
            if(!once) {
                assignments.value.map((assignment: Assignment) => {
                    if(assignment.ref) {
                        assignment.selected = false;
                        assignment.top = 'auto';
                        assignment.left = 'auto';
        
                        assignment.ref.addEventListener('mousedown', () => {
                            if(edit.value) {
                                assignment.selected = true;
                                
                                assignment.ref!.style.zIndex = '1000';
                                assignment.ref!.style.userSelect = 'none';
                                
                                mouse.xOffset = (mouse.x - assignment.ref!.getBoundingClientRect().left) * 1;
                                mouse.yOffset = (mouse.y - assignment.ref!.getBoundingClientRect().top) * 1;
                                
                                assignment.top = `${mouse.y - mouse.yOffset + document.documentElement.scrollTop}px`;
                                assignment.left = `${mouse.x - mouse.xOffset}px`;
                            };
                        });
                    };
                });
    
                once = true;
            };
        };
    });
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
                <h2 class="u-margin-0 u-weight-400 u-margin-right-md">{{ category.name }}</h2>
                <button v-if="edit" class="c-button__icon c-button__icon-orange u-margin-right-x-md" @click="toggleUpdateCategoryPopup">
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

        <section v-if="category" class="u-margin-bottom-lg">
            <AssignmentElement class="u-margin-bottom-x-lg" :add="true" name="Create assignment" :edit="edit" @click="toggleAddAssignmentPopup" />

            <div v-if="assignments" class="c-assignmentelements">
                <div v-for="(placeholder, index) in assignments" :key="index" class="c-assignmentelement__placeholder" :style="{ gridRow: `${placeholder.position} / auto`, gridColumn: `1 / auto`, width: `${placeholder.width}px`, height: `${placeholder.height}px` }"></div>

                <AssignmentElement :setRef="setElementRef" v-for="(assignment, index) in assignments" :key="index" :index="index" class="c-assignmentelement" :class="edit ? 'c-assignmentelement__moving' : ''" :assignment="assignment" :edit="edit" :updateAction="updateThisAssignmentAction" :deleteAction="deleteThisAssignemntAction" :style="{ gridRow: `${assignment.position} / auto`, gridColumn: `1 / auto`, top: assignment.top, left: assignment.left, position: assignment.selected ? 'absolute' : 'relative' }"/>
            </div>
        </section>
    </div>

    <Popup v-if="addCategoryPopup" title="Create category" :toggleClose="toggleAddCategoryPopup" buttonLabel="Create category" :buttonAction="addCategorySubmit">
        <Input label="Name" symbol="category" type="text" placeholder="Fundamentals" :model="addThisCategory" modelName="name" />
    </Popup>

    <Popup v-if="updateCategoryPopup" title="Update category" :toggleClose="toggleUpdateCategoryPopup" buttonLabel="Update category" :buttonAction="updateCategorySubmit">
        <Input label="Name" symbol="category" type="text" placeholder="Fundamentals" :model="updateThisCategory" modelName="name" />
    </Popup>

    <Popup v-if="addAssignmentPopup" title="Create assignment" :toggleClose="toggleAddAssignmentPopup" buttonLabel="Create assignment" :buttonAction="addAssignmentSubmit">
        <Input label="Subject" symbol="document" type="text" placeholder="Introduction to paragraphs" :model="addThisAssignment" modelName="subject" />
    </Popup>

    <Popup v-if="updateAssignmentPopup" title="Update assignment" :toggleClose="toggleUpdateAssignmentPopup" buttonLabel="Update assignment" :buttonAction="updateAssignmentSubmit">
        <Input label="Subject" symbol="document" type="text" placeholder="Introduction to paragraphs" :model="updateThisAssignment" modelName="subject" />
    </Popup>
</template>
