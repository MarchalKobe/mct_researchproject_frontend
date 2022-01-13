<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import BigItem from '../components/BigItem.vue';
    import { computed, reactive, ref } from 'vue';
    import { GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const edit = ref<boolean>(false);

    const toggleEdit = () => edit.value = !edit.value;
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
                <BigItem v-if="user.information.type === 1" :add="true" name="Add class" />
                <BigItem :add="true" name="Join class" />
                <BigItem :edit="edit" name="4BOIN" />
            </div>
        </section>
    </div>
</template>
