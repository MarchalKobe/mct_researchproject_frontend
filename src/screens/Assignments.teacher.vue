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
    import LevelElement from '../components/LevelElement.vue';
    import UpdateAssignmentInput from '../types/UpdateAssignmentInput';
    import Level from '../types/Level';
    import { useLoading } from '../store/loading';

    const { getClassroom, getCategory, getCategoriesByClassroom, addCategory, updateCategory, deleteCategory, getAssignmentsByCategory, addAssignment, updateAssignment, deleteAssignment } = useNetwork();

    const { addLoading, removeLoading } = useLoading();

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

    const category = ref<Category | null>(null);

    const assignments = ref<Assignment[]>([]);

    const levelsDone = ref<boolean>(false);

    const edit = ref<boolean>(false);
    const toggleEdit = () => edit.value = !edit.value;;

    const addCategoryPopup = ref<boolean>(false);
    const toggleAddCategoryPopup = () => addCategoryPopup.value = !addCategoryPopup.value;

    const updateCategoryPopup = ref<boolean>(false);
    const toggleUpdateCategoryPopup = () => updateCategoryPopup.value = !updateCategoryPopup.value;

    const addAssignmentPopup = ref<boolean>(false);
    const toggleAddAssignmentPopup = () => addAssignmentPopup.value = !addAssignmentPopup.value;

    const updateAssignmentPopup = ref<boolean>(false);
    const toggleUpdateAssignmentPopup = () => updateAssignmentPopup.value = !updateAssignmentPopup.value;

    const getThisClassroom = async () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getClassroom(token, classroomId);
            getThisCategoriesByClassroom();
            classroom.value = response.data.getClassroom;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const getThisCategory = async () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getCategory(token, selectedCategory.categoryId);
            category.value = response.data.getCategory;
            updateThisCategory.name = category.value!.name;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const getThisAssignmentsByCategory = async () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            if(assignments.value.length) {
                assignments.value.map((assignment: Assignment) => {
                    assignment.ref!.removeEventListener('mousedown', assignmentMouseDownAction.bind(null, assignment), false);
                });
            };

            const response = await getAssignmentsByCategory(token, selectedCategory.categoryId);
            assignments.value = response.data.getAssignmentsByCategory;

            levelsDone.value = true;

            assignments.value.map((as: Assignment) => {
                as.levels!.map((level: Level) => {
                    if(level.status !== 2) levelsDone.value = false;
                });
            });

            once.value = false;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const getThisCategoriesByClassroom = () => {
        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await getCategoriesByClassroom(token, classroomId);

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

        removeLoading();
    };

    const addCategorySubmit = () => {
        if(!window.confirm('Are your sure you want to create this category?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await addCategory(token, { name: addThisCategory.name, classroomId: classroomId });
            getThisCategoriesByClassroom();
            toggleAddCategoryPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const toggleCategoryVisible = () => {
        if(!window.confirm(`Are your sure you want to make this category ${category.value!.visible ? 'in' : ''}visible?${!category.value!.visible ? ' This will make other categories invisible.' : ''}`)) return;

        addLoading();

        updateThisCategory.visible = !category.value!.visible;

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateCategory(token, { categoryId: selectedCategory.categoryId, name: updateThisCategory.name, visible: updateThisCategory.visible });
            getThisCategoriesByClassroom();
            getThisCategory();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const makeCategoryDone = () => {
        if(!window.confirm('Are you sure you want to finalize this category? You can\'t edit the assignments after this action and this can\'t be undone.')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateCategory(token, { categoryId: selectedCategory.categoryId, name: updateThisCategory.name, done: true });
            getThisCategoriesByClassroom();
            getThisCategory();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const updateCategorySubmit = () => {
        if(!window.confirm('Are your sure you want to update this category?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateCategory(token, { categoryId: selectedCategory.categoryId, name: updateThisCategory.name });
            getThisCategoriesByClassroom();
            getThisCategory();
            toggleUpdateCategoryPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const deleteThisCategoryAction = () => {
        if(!window.confirm('Are your sure you want to delete this category?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await deleteCategory(token, selectedCategory.categoryId );
            getThisCategoriesByClassroom();
            selectedCategory.categoryId = '';
            assignments.value = [];
            category.value = null;
            edit.value = false;
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const addAssignmentSubmit = () => {
        if(!window.confirm('Are your sure you want to create this assignment?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await addAssignment(token, { subject: addThisAssignment.subject, categoryId: selectedCategory.categoryId });
            getThisAssignmentsByCategory();
            toggleAddAssignmentPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const updateAssignmentSubmit = () => {
        if(!window.confirm('Are your sure you want to update this assignment?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateAssignment(token, { assignmentId: updateThisAssignment.assignmentId!, subject: updateThisAssignment.subject });
            getThisAssignmentsByCategory();
            toggleUpdateAssignmentPopup();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };

    const updateThisAssignmentAction = (assignmentId: string) => {
        updateThisAssignment.assignmentId = assignmentId;
        updateThisAssignment.subject = assignments.value.find((assignment: Assignment) => assignment.assignmentId === assignmentId)!.subject;
        toggleUpdateAssignmentPopup();
    };

    const deleteThisAssignmentAction = (assignmentId: string) => {
        if(!window.confirm('Are your sure you want to delete this assignment?')) return;

        addLoading();

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await deleteAssignment(token, assignmentId);
            getThisAssignmentsByCategory();
        }).catch((error: string) => {
            console.error(error);
        });

        removeLoading();
    };
    
    watch(() => selectedCategory.categoryId, () => {
        if(selectedCategory.categoryId.length) {
            edit.value = false;
            getThisCategory();
            getThisAssignmentsByCategory();
        };
    });

    getThisClassroom();

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
                                if(as.position! <= assignment.position! && as.position !== selectedAssignment!.position && as.position! > selectedAssignment!.position!) {
                                    as.position!--;

                                    getIdToken(user.information.user as User).then(async (token: string) => {
                                        const response = await updateAssignment(token, as as UpdateAssignmentInput);
                                    }).catch((error: string) => {
                                        console.error(error);
                                    });
                                };
                            });
                        } else {
                            assignments.value.map((as: Assignment) => {
                                if(as.position! >= assignment.position! && as.position !== selectedAssignment!.position && as.position! < selectedAssignment!.position!) {
                                    as.position!++;
                                    
                                    getIdToken(user.information.user as User).then(async (token: string) => {
                                        const response = await updateAssignment(token, as as UpdateAssignmentInput);
                                    }).catch((error: string) => {
                                        console.error(error);
                                    });
                                };
                            });
                        };
                        
                        selectedAssignment!.position = position;

                        getIdToken(user.information.user as User).then(async (token: string) => {
                            const response = await updateAssignment(token, selectedAssignment as UpdateAssignmentInput);
                        }).catch((error: string) => {
                            console.error(error);
                        });
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

    const once = ref<boolean>(false);

    const assignmentMouseDownAction = (assignment: Assignment) => {
        if(edit.value) {
            assignment.selected = true;
            
            assignment.ref!.style.zIndex = '1000';
            assignment.ref!.style.userSelect = 'none';
            
            mouse.xOffset = (mouse.x - assignment.ref!.getBoundingClientRect().left) * 1;
            mouse.yOffset = (mouse.y - assignment.ref!.getBoundingClientRect().top) * 1;
            
            assignment.top = `${mouse.y - mouse.yOffset + document.documentElement.scrollTop}px`;
            assignment.left = `${mouse.x - mouse.xOffset}px`;
        };
    };

    onUpdated(() => {
        if(assignments.value.length) {
            setCoordinates();
    
            if(!once.value) {
                assignments.value.map((assignment: Assignment) => {
                    if(assignment.ref) {
                        assignment.selected = false;
                        assignment.top = 'auto';
                        assignment.left = 'auto';
                        assignment.ref.addEventListener('mousedown', assignmentMouseDownAction.bind(null, assignment), false);
                    };
                });
    
                once.value = true;
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

        <div class="u-flex u-align-center u-justify-space-between u-wrap u-margin-bottom-md">
            <button v-if="classroom.open" class="c-button__normal u-margin-bottom-md" @click="toggleAddCategoryPopup">Create category</button>

            <div v-if="classroom.open && category && assignments.length" class="u-margin-bottom-md">
                <button v-if="!category.done && levelsDone" class="c-button__normal" @click="makeCategoryDone">Finalize this category</button>
                <button v-if="category.done && levelsDone" class="c-button__normal" @click="toggleCategoryVisible">{{ category.visible ? 'Make category invisible' : 'Make category visible' }}</button>
            </div>

            <Select class="u-margin-bottom-md u-width-14" :description="categoryOptions.length ? 'Select category' : 'No categories found'" :model="selectedCategory" modelName="categoryId" :options="categoryOptions" />
        </div>

        <div v-if="category" class="u-flex u-align-center u-justify-space-between u-margin-bottom-lg">
            <div class="u-flex u-align-center">
                <h2 class="u-margin-0 u-weight-400 u-margin-right-md">{{ category.name }}</h2>
                <button v-if="!category.done && edit" class="c-button__icon c-button__icon-orange u-margin-right-x-md" @click="toggleUpdateCategoryPopup">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                </button>
                <button v-if="!category.done && edit" class="c-button__icon c-button__icon-alpha" @click="deleteThisCategoryAction">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
            <span v-if="!category.done && edit" class="u-color-orange">Hold the assignments to move them in order</span>
            <button v-if="!category.done" class="c-button__soft u-color-x-light" @click="toggleEdit">{{ edit ? 'Done' : 'Edit' }}</button>
        </div>
        <div v-else>
            <p>No category selected</p>
        </div>

        <section v-if="category" class="u-margin-bottom-lg">
            <AssignmentElement v-if="!category.done" class="u-margin-bottom-x-lg" :add="true" name="Create assignment" :edit="edit" @click="toggleAddAssignmentPopup" />

            <div v-if="assignments" class="c-assignmentelements">
                <div v-for="(placeholder, index) in assignments" :key="index" class="c-assignmentelement__placeholder" :style="{ gridRow: `${placeholder.position} / auto`, gridColumn: `1 / auto`, width: `${placeholder.width}px`, height: `${placeholder.height}px` }"></div>

                <AssignmentElement :setRef="setElementRef" v-for="(assignment, index) in assignments" :key="index" :index="index" openLabel="Levels" class="c-assignmentelement" :class="edit ? 'c-assignmentelement__moving' : ''" :assignment="assignment" :edit="edit" :updateAction="updateThisAssignmentAction" :deleteAction="deleteThisAssignmentAction" :style="{ gridRow: `${assignment.position} / auto`, gridColumn: `1 / auto`, top: assignment.top, left: assignment.left, position: assignment.selected ? 'absolute' : 'relative' }">
                    <div class="u-margin-top-x-md">
                        <LevelElement v-for="(level, index) in assignment.levels" :key="index" :level="level" :classroomId="classroomId" :category="category" />
                    </div>
                </AssignmentElement>
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
