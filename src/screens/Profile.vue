<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { reactive } from 'vue';
    import Input from '../components/Input.vue';

    const general = reactive({
        firstName: '',
        lastName: '',
        email: '',
    });

    const password = reactive({
        current: '',
        password: '',
        confirm: '',
    });

    const updateThisGeneral = () => {
        console.log(general);
    };

    const updateThisPassword = () => {
        console.log(password);
    };
</script>

<template>
    <Navbar />

    <div class="e-container">
        <Header title="Profile" />

        <section class="u-width-24 u-margin-bottom-lg">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">General</h2>
    
            <form @submit.prevent>
                <div class="u-flex">
                    <Input class="u-margin-right-md" label="First name" symbol="user" type="text" placeholder="John" :model="general" modelName="firstName" :required="true" />
                    <Input label="Last name" symbol="user" type="text" placeholder="Doe" :model="general" modelName="lastName" :required="true" />
                </div>

                <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="general" modelName="email" :required="true" />

                <button class="c-button__large u-margin-bottom-md" @click="updateThisGeneral">Update general</button>
            </form>
        </section>

        <section class="u-width-24 u-margin-bottom-lg">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">Password</h2>
    
            <form @submit.prevent>
                <Input label="Current password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="password" modelName="current" :required="true" />
                <Input label="Password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="password" modelName="password" :required="true" />
                <Input label="Confirm password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="password" modelName="confirm" :required="true" />

                <button class="c-button__large u-margin-bottom-md" @click="updateThisPassword">Update password</button>
            </form>
        </section>

        <section class="u-width-24">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">Settings</h2>
    
            <form @submit.prevent>

            </form>
        </section>
    </div>
</template>
