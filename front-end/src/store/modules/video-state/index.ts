import {VideoState} from '../../../models/video-state';
import {ActionContext} from 'vuex';

const videoStateModule = {
    namespaced: true,
    state() {
        return {
            'videoState': VideoState.Idle
        };
    },
    mutations: {
        updateLocally(state: any, newState: VideoState) {
            if(state.videoState == newState) {
                return;
            }

            state.videoState = newState;
            // console.log('Updating video state locally...', state.videoState, '->', newState);
        }
    },
    actions: {
        updateOnServer: async (context: ActionContext<any, any>, newVideoState: VideoState) => {
            const themeId = context.rootState.themeId;
            const updateResponse = await context.dispatch('sendHttpRequest', {
                url: `http://localhost:4000/update-state?themeId=${themeId}&state=${newVideoState}`,
                responseType: 'json'
            }, {root: true});
            // TODO: Handle errors
            console.log('Server state:', updateResponse);
        },
        updateFromServer: async (context: ActionContext<any, any>) => {
            // console.log("Retrieving video state from server...");
            const videoState: string = await context.dispatch('sendHttpRequest', {
                url: `http://localhost:4000/get-state?themeId=${context.rootState.themeId}`,
                responseType: 'json'
            }, {root: true});
            // TODO: Handle errors
            context.commit('updateLocally', videoState);
        }
    },
    getters: {
        getState: (state: any, getters: any) => {
            return state.videoState;
        }
    },
};

export default videoStateModule;
