import {VideoState} from '../../../models/video-state';
import {ActionContext} from 'vuex';
import config from '../../../config';

const videoStateModule = {
    namespaced: true,
    state() {
        return {
            'videoState': VideoState.Idle
        };
    },
    mutations: {
        updateLocally(state: any, newState: VideoState) {
            if (state.videoState == newState) {
                return;
            }

            state.videoState = newState;
            // console.log('Updating video state locally...', state.videoState, '->', newState);
        }
    },
    actions: {
        updateOnServer: async (context: ActionContext<any, any>, newVideoState: VideoState) => {
            const themeId = context.rootState.themeId;
            await context.dispatch('sendHttpRequest', {
                url: `${config.SERVER_URL}/update-state?themeId=${themeId}&state=${newVideoState}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not update state on server...', error);
                context.commit('updateLocally', VideoState.ServerError);
            });
        },
        updateFromServer: async (context: ActionContext<any, any>) => {
            // console.log("Retrieving video state from server...");
            await context.dispatch('sendHttpRequest', {
                url: `${config.SERVER_URL}/get-state?themeId=${context.rootState.themeId}`,
                responseType: 'json'
            }, {root: true}).then(videoState => {
                context.commit('updateLocally', videoState);
            }).catch(error => {
                console.warn('Could not retrieve state from server...', error);
                context.commit('updateLocally', VideoState.ServerError);
            });
        }
    },
    getters: {
        getState: (state: any, getters: any) => {
            return state.videoState;
        }
    },
};

export default videoStateModule;
