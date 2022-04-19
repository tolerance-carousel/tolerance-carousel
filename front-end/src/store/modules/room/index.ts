const roomModule = {
    namespaced: true,
    state() {
        return {
            id: null
        };
    },
    mutations: {
        selectById: (state, roomId: string) => {
            state.id = roomId;
            console.log("Selected room:", state.id);
            return;
        }
    },
    actions: {},
    getters: {
        getId: (state): string => {
            return state.id;
        }
    },
};

export default roomModule;
