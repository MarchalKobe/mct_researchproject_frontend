<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Header from '../components/Header.vue';
    import { computed, reactive } from 'vue';
    import Input from '../components/Input.vue';
    import UpdateGeneralInput, { UpdateGeneralError } from '../types/UpdateGeneralInput';
    import UpdatePasswordInput, { UpdatePasswordError } from '../types/UpdatePasswordInput';
    import { getIdToken, User } from 'firebase/auth';
    import { ActionTypes, GetterTypes, UserState } from '../store/modules/user';
    import store from '../store';
    import { useNetwork } from '../utils/networkComposable';
    import UpdateEmailInput, { UpdateEmailError } from '../types/UpdateEmailInput';
    import router from '../bootstrap/router';
    import Select from '../components/Select.vue';
    import UpdateEditorInput from '../types/UpdateEditorInput';
    import SelectOption from '../types/SelectOption';
    import { validateEmail } from '../helpers/ValidateEmail';

    const { updateAccountGeneral, updateAccountEmail, updateAccountPassword, updateAccountEditor } = useNetwork();

    const user = reactive<{ information: UserState }>({
        information: computed(() => store.getters[GetterTypes.GET_USER_INFORMATION]()).value,
    });

    const general = reactive<UpdateGeneralInput>({
        firstName: user.information.firstName,
        lastName: user.information.lastName,
    });

    const generalError = reactive<UpdateGeneralError>({
        firstName: null,
        lastName: null,
    });

    const email = reactive<UpdateEmailInput>({
        email: user.information.email,
    });

    const emailError = reactive<UpdateEmailError>({
        email: null,
    });

    const password = reactive<UpdatePasswordInput>({
        current: '',
        password: '',
        confirm: '',
    });

    const passwordError = reactive<UpdatePasswordError>({
        current: null,
        password: null,
        confirm: null,
    });

    const editor = reactive<UpdateEditorInput>({
        preferredTheme: user.information.preferredTheme,
    });

    const editorSelectOptions = reactive<SelectOption[]>([
        {
            id: 'dark',
            value: 'Dark',
        },
        {
            id: 'light',
            value: 'Light',
        },
    ]);

    const updateThisAccountGeneral = () => {
        generalError.firstName = general.firstName.length ? null : 'Field required';

        generalError.lastName = general.lastName.length ? null : 'Field required';

        if(!Object.values(generalError).every(error => error === null)) return;

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateAccountGeneral(token, general);
            console.log({ response });
            window.alert('Account general successfully changed. Log back in to see the changes.');
            
            store.dispatch(ActionTypes.LOGOUT_USER).then(() => {
                router.push('/login');
            });
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const updateThisAccountEmail = () => {
        emailError.email = email.email.length ? null : 'Field required';
        if(!emailError.email) emailError.email = validateEmail(email.email) ? null : 'Not a valid email address';

        if(!Object.values(emailError).every(error => error === null)) return;

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
    };

    const updateThisPassword = () => {
        passwordError.current = password.current.length ? null : 'Field required';
        if(!passwordError.current) passwordError.current = password.current.length >= 5 ? null : 'At least 5 characters';

        passwordError.password = password.password.length ? null : 'Field required';
        if(!passwordError.password) passwordError.password = password.password.length >= 5 ? null : 'At least 5 characters';

        passwordError.confirm = password.confirm!.length ? null : 'Field required';
        if(!passwordError.confirm) passwordError.confirm = password.confirm!.length >= 5 ? null : 'At least 5 characters';

        if(!passwordError.password || !passwordError.confirm) passwordError.confirm = password.password === password.confirm ? null : 'Passwords don\'t match';

        if(!Object.values(passwordError).every(error => error === null)) return;

        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateAccountPassword(token, password);
            console.log({ response });
            window.alert('Account password successfully changed. Log back in to see the changes.');

            store.dispatch(ActionTypes.LOGOUT_USER).then(() => {
                router.push('/login');
            });
        }).catch((error: string) => {
            console.error(error);
        });
    };

    const updateThisEditor = () => {
        getIdToken(user.information.user as User).then(async (token: string) => {
            const response = await updateAccountEditor(token, editor);
            console.log({ response });
            window.alert('Account editor successfully changed. Log back in to see the changes.');

            store.dispatch(ActionTypes.LOGOUT_USER).then(() => {
                router.push('/login');
            });
        }).catch((error: string) => {
            console.error(error);
        });
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
                    <Input class="u-margin-right-md" label="First name" symbol="user" type="text" placeholder="John" :model="general" modelName="firstName" :required="true" :error="generalError.firstName" />
                    <Input label="Last name" symbol="user" type="text" placeholder="Doe" :model="general" modelName="lastName" :required="true" :error="generalError.lastName" />
                </div>

                <button class="c-button__large u-margin-bottom-md" @click="updateThisAccountGeneral">Update general</button>
            </form>
        </section>

        <section class="u-width-24 u-margin-bottom-lg">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">Email</h2>
    
            <form @submit.prevent>
                <Input label="Email" symbol="email" type="email" placeholder="john.doe@example.com" :model="email" modelName="email" :required="true" :error="emailError.email" />

                <button class="c-button__large u-margin-bottom-md" @click="updateThisAccountEmail">Update email</button>
            </form>
        </section>

        <section class="u-width-24 u-margin-bottom-lg">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">Password</h2>
    
            <form @submit.prevent>
                <Input label="Current password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="password" modelName="current" :required="true" :error="passwordError.current" />
                <Input label="Password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="password" modelName="password" :required="true" :error="passwordError.password" />
                <Input label="Confirm password" symbol="password" type="password" placeholder="●●●●●●●●●●●●" :model="password" modelName="confirm" :required="true" :error="passwordError.confirm" />

                <button class="c-button__large u-margin-bottom-md" @click="updateThisPassword">Update password</button>
            </form>
        </section>

        <section class="u-width-24 u-margin-bottom-lg">
            <h2 class="u-margin-0 u-margin-bottom-md u-weight-400">Settings</h2>
    
            <form @submit.prevent>
                <Select label="Editor theme" description="Select editor theme" :model="editor" modelName="preferredTheme" :options="editorSelectOptions" :required="true" />

                <button class="c-button__large u-margin-bottom-md" @click="updateThisEditor">Update editor theme</button>
            </form>
        </section>
    </div>
</template>
