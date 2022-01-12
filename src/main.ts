import { createApp, App as AppInterface } from 'vue';
import App from './App.vue';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './../firebaseConfig.json';
import router from './bootstrap/router';
import store from './store/index';
import { ActionTypes } from './store/modules/user';

initializeApp(firebaseConfig);

store.dispatch(ActionTypes.RESTORE_AUTH).then(() => {
    const app: AppInterface = createApp(App);
    app.use(router);
    app.use(store);
    app.mount('#app');
});
