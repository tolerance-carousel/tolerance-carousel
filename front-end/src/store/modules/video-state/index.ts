import {VideoPlayerState, VideoState} from '../../../models/video-state';
import {ActionContext} from 'vuex';
import config from '../../../config';

const videoStateModule = {
    namespaced: true,
    state() {
        return {
            playerState: {
                videoState: VideoState.Idle,
                videoNum: 0
            }
        };
    },
    mutations: {
        updateLocally(state: any, newState: VideoPlayerState) {
            // console.log("Updating local video player state...", newState);
            if (JSON.stringify(state.playerState) == JSON.stringify(newState)) {
                return;
            }

            state.playerState = newState;
            console.log('Updated video player state locally...', state.playerState, '->', newState);
        },
    },
    actions: {
        updateVideoStateLocally: (context: ActionContext<any, any>, videoState: VideoState) => {
            const playerState: VideoPlayerState = context.state.playerState;
            playerState.videoState = videoState;
            context.commit('updateLocally', playerState);  
        },
        updateVideoStateOnServer: async (context: ActionContext<any, any>, newState: VideoState) => {
            const themeId: string = context.rootGetters['themeModule/getIdStr'];
            if (!themeId) {
                console.log('Did not update server state for theme', themeId);
                return;
            }

            await context.dispatch('sendHttpRequest', {
                url: `${config.SERVER_URL}/update-video-state?themeId=${themeId}&state=${newState}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not update video state on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        goToNextVideoOnServer: async (context: ActionContext<any, any>) => {
            const themeId: string = context.rootGetters['themeModule/getIdStr'];
            if (!themeId) {
                console.log('Did not update server state for theme', themeId);
                return;
            }

            await context.dispatch('sendHttpRequest', {
                url: `${config.SERVER_URL}/next-video?themeId=${themeId}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not update video state on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        updateFromServer: async (context: ActionContext<any, any>) => {
            // console.log("Retrieving video state from server...");
            const themeId: string = context.rootGetters['themeModule/getIdStr'];
            if (!themeId) {
                return;
            }
            await context.dispatch('sendHttpRequest', {
                url: `${config.SERVER_URL}/get-state?themeId=${context.rootGetters['themeModule/getIdStr']}`,
                responseType: 'json'
            }, {root: true}).then(playerState => {
                context.commit('updateLocally', playerState);
            }).catch(error => {
                console.warn('Could not retrieve state from server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        }
    },
    getters: {
        getState: (state: any) => {
            return state.playerState;
        }
    },
};

export default videoStateModule;
