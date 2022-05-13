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
            console.log("Updating local state...", newState);
            if (JSON.stringify(state.playerState) == JSON.stringify(newState)) {
                return;
            }

            state.playerState = newState;
            console.log('Updated video player state locally...', state.playerState, '->', newState);
        },
    },
    actions: {
        updateVideoStateLocally: (context: ActionContext<any, any>, videoState: VideoState) => {
            console.log("Updating local video player state...", videoState);
            const playerState: VideoPlayerState = context.state.playerState;
            playerState.videoState = videoState;
            context.commit('updateLocally', playerState);
        },
        updateVideoStateOnServer: async (context: ActionContext<any, any>, newState: VideoState) => {
            console.log("Updating video state on server...", newState);

            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.log('Did not update server state for room', roomId);
                return;
            }

            const password: string = context.rootGetters['passwordModule/getPassword'];
            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/update-video-state?roomId=${roomId}&state=${newState}&pw=${password}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not update video state on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        resetRoomShowOnServer: async (context: ActionContext<any, any>) => {
            console.log("Resetting room on server...");
            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.log('Did not reset show for room', roomId);
                return;
            }

            const password: string = context.rootGetters['passwordModule/getPassword'];
            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/reset-video?roomId=${roomId}&pw=${password}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not reset room show on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        goToNextVideoOnServer: async (context: ActionContext<any, any>) => {
            console.log("Go to next video on server...");

            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.log('Did not update server state for room', roomId);
                return;
            }

            const password: string = context.rootGetters['passwordModule/getPassword'];
            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/next-video?roomId=${roomId}&pw=${password}`,
                responseType: 'json'
            }, {root: true}).then(response => {
                console.log('Server state:', response);
            }).catch(error => {
                console.warn('Could not update video state on server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        updateFromServer: async (context: ActionContext<any, any>) => {
            console.log("Retrieving video state from server...", import.meta.env);
            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                return;
            }
            await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/get-state?roomId=${roomId}`,
                responseType: 'json'
            }, {root: true}).then(playerState => {
                if (!playerState) {
                    context.dispatch('updateVideoStateLocally', VideoState.ServerError);
                } else {
                    context.commit('updateLocally', playerState);
                }
            }).catch(error => {
                console.warn('Could not retrieve state from server...', error);
                context.dispatch('updateVideoStateLocally', VideoState.ServerError);
            });
        },
        getRoomStatesFromServer: async (context: ActionContext<any, any>) => {
            console.log("Retrieving room states from server...", import.meta.env);
            return await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/get-states`,
                responseType: 'json'
            }, {root: true}).catch(error => {
                console.warn('Could not retrieve states from server...', error);
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
