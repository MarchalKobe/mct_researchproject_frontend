import { Auth, getAuth, getIdTokenResult, signOut, User } from '@firebase/auth';
import { Commit, Dispatch } from 'vuex';

export type UserState = {
    user: User | null,
    firstName: string,
    lastName: string,
    email: string,
    loggedIn: boolean,
    preferredTheme: string,
    type: number,
};

export enum GetterTypes {
    GET_USER_INFORMATION = 'getUserInformation',
};

export enum MutationTypes {
    LOGIN_USER = 'loginUser',
    LOGOUT_USER = 'logoutUser',
};

export enum ActionTypes {
    LOGOUT_USER = 'logoutUser',
    RESTORE_AUTH = 'restoreAuth',
};

const state: UserState = {
    user: null,
    firstName: '',
    lastName: '',
    email: '',
    loggedIn: false,
    preferredTheme: '',
    type: -1,
};

export default {
    state: state,
    
    getters: {
        [GetterTypes.GET_USER_INFORMATION]: (state: UserState) => () => {
            console.log({ state });
            return state;
        },
    },
    
    mutations: {
        [MutationTypes.LOGIN_USER](state: UserState, information: UserState) {
            state.user = information.user;
            state.firstName = information.firstName;
            state.lastName = information.lastName;
            state.email = information.email;
            state.loggedIn = !information.loggedIn;
            state.preferredTheme = information.preferredTheme;
            state.type = information.type;
        },
        
        [MutationTypes.LOGOUT_USER](state: UserState) {
            state.user = null;
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.loggedIn = false;
            state.preferredTheme = '';
            state.type = -1;
        },
    },
    
    actions: {
        [ActionTypes.LOGOUT_USER]({ commit }: { commit: Commit }) {
            return new Promise((resolve, reject) => {
                const auth = getAuth();

                signOut(auth).then(() => {
                    commit(MutationTypes.LOGOUT_USER);
                    // console.log('LOGGED OUT!');
                    resolve(true);
                }).catch((error) => {
                    console.error(error);
                    reject(false);
                });
            });
        },

        [ActionTypes.RESTORE_AUTH]({ commit, dispatch }: { commit: Commit, dispatch: Dispatch }): Promise<void> {
            return new Promise((resolve, reject) => {
                const auth: Auth = getAuth();

                try {
                    auth.onAuthStateChanged(async (user: User | null) => {
                        if(user) {
                            getIdTokenResult(user).then((idTokenResult) => {
                                commit(MutationTypes.LOGIN_USER, { user: user, firstName: idTokenResult.claims.firstName, lastName: idTokenResult.claims.lastName, email: idTokenResult.claims.email, type: idTokenResult.claims.type });
                                resolve();
                            }).catch((error) => {
                                console.error(error);
                                reject();
                            });
                        } else {
                            dispatch(ActionTypes.LOGOUT_USER).then(() => {
                                resolve();
                            });
                        };
                    });
                } catch(error) {
                    console.error(error);
                    reject();
                };
            });
        },
    },
};
