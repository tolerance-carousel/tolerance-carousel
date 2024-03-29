const passwordModule = {
    namespaced: true,
    state() {
        return {
            password: ''
        };
    },
    mutations: {
        update: (state, password: string) => {
            state.password = password;
            console.log("Updated password:", state.password);
            return;
        }
    },
    actions: {},
    getters: {
        getPassword: (state): string => {
            return state.password;
        },
        noPasswordEntered: (state): boolean => {
            return !state.password || state.password === "";
        }
    },
};

export default passwordModule;
