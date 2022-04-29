import {VideoPlayerState, VideoState} from '../../../models/video-state';
import {ActionContext} from 'vuex';

const videoStateModule = {
    namespaced: true,
    state() {
        return {
            playerState: {
                currentTheme: "religion",
                videoState: VideoState.Welcome,
                startsAt: -1
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
            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.log('Did not update server state for room', roomId);
                return;
            }

            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/update-video-state?roomId=${roomId}&state=${newState}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not update video state on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        resetRoomShowOnServer: async (context: ActionContext<any, any>) => {
            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.log('Did not reset show for room', roomId);
                return;
            }

            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/reset-video?roomId=${roomId}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not reset room show on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        goToNextVideoOnServer: async (context: ActionContext<any, any>) => {
            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.log('Did not update server state for room', roomId);
                return;
            }

            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/next-video?roomId=${roomId}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not update video state on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        updateFromServer: async (context: ActionContext<any, any>) => {
            // console.log("Retrieving video state from server...", import.meta.env);
            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                return;
            }
            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/get-state?roomId=${roomId}`,
                responseType: 'json'
            }, {root: true}).then(playerState => {
                if(!playerState) {
                    context.dispatch('updateVideoStateLocally', VideoState.ServerError);
                } else {
                    context.commit('updateLocally', playerState);
                }
            }).catch(error => {
                console.warn('Could not retrieve state from server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        }
    },
    getters: {
        getState: (state: any) => {
            return state.playerState;
        },
        getVideoPath: (state: any) => {
            return `/videos/${state.playerState.currentTheme}/${state.playerState.currentTheme}.m4v`;
        }
    },
};

export default videoStateModule;
