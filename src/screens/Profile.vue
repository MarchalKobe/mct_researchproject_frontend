<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive } from 'vue';
    import Input from '../components/Input.vue';
    import UpdateGeneralInput from '../types/UpdateGeneralInput';
    import UpdatePasswordInput from '../types/UpdatePasswordInput';
    import { getIdToken, User } from 'firebase/auth';
    import { ActionTypes, GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import UpdateEmailInput from '../types/UpdateEmailInput';
    import router from '../bootstrap/router';

    const { updateAccountGeneral, updateAccountEmail } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const general = reactive<UpdateGeneralInput>({
        firstName: user.information.firstName,
        lastName: user.information.lastName,
    });

    const email = reactive<UpdateEmailInput>({
        email: user.information.email,
    });

    const password = reactive<UpdatePasswordInput>({
        current: '',
        password: '',
        confirm: '',
    });

    const updateThisAccountGeneral = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateAccountGeneral(token, general);
            console.log({ response });
            window.alert('Account general successfully changed. Log back in to see the changes');
            
            store.dispatch(ActionTypes.LOGOUT_USER).then(() => {
                router.push('/login');
            });
        }).catch((error: string) => {
            console.error(error);
        });
        
        console.log(general);
    };

    const updateThisAccountEmail = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateAccountEmail(token, email);
            console.log({ response });
            window.alert('Account email successfully changed. Confirm email and log back in.');

            store.dispatch(ActionTypes.LOGOUT_USER).then(() => {
                router.push('/login');
            });
        }).catch((error: string) => {
            console.error(error);
        });
        
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

                <button class="c-button__large u-margin-bottom-md" @click="updateThisAccountGeneral">Update general</button>
            </form>
        </section>

        <section class="u-width-24 u-margin-bottom-lg">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">Email</h2>
    
            <form @submit.prevent>
                <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="email" modelName="email" :required="true" />

                <button class="c-button__large u-margin-bottom-md" @click="updateThisAccountEmail">Update email</button>
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
