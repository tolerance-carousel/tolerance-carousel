import {VideoPlayerState, VideoPlayerStates, VideoState} from '../../../models/video-state';
import {ActionContext} from 'vuex';

// TODO: Make state typed
const videoStateModule = {
    namespaced: true,
    state() {
        return {
            playerStates: null,
            playerState: {
                currentTheme: "religion",
                videoState: VideoState.Welcome,
                startsAt: -1
            },
            socket: WebSocket
        };
    },
    mutations: {
        setPlayerStates(state: any, newPlayerStates: VideoPlayerStates) {
            console.log("Updating player states...", state.playerStates, '->', newPlayerStates);
            if (JSON.stringify(state.playerStates) == JSON.stringify(newPlayerStates)) {
                return;
            }

            state.playerStates = newPlayerStates;
            console.log('Updated player states successfully!');
        },
        setPlayerState(state: any, newPlayerState: VideoPlayerState) {
            console.log("Updating player state...", state.playerState, '->', newPlayerState);
            if (JSON.stringify(state.playerState) == JSON.stringify(newPlayerState)) {
                return;
            }

            state.playerState = newPlayerState;
            console.log('Updated player state locally');
        },
        setSocket(state: any, socket: WebSocket) {
            state.socket = socket;
        },
    },
    actions: {
        initializeSocketConnection: async (context: ActionContext<any, any>) => {
            console.log("Initializing websocket connection...");
            const socket: WebSocket = new WebSocket(`${import.meta.env.APP_WEBSOCKET_URL}`);
            context.commit('setSocket', socket);

            socket.onopen = (_) => {
                console.log("Websocket connection established");
            };

            socket.onmessage = function (event) {
                console.log(`Data received from server: ${event.data}`);
                let states: VideoPlayerStates | null = null;
                try {
                    states = JSON.parse(event.data);
                    // console.log("Server states:", states);
                } catch (e) {
                    console.error(e);
                    return;
                }

                if (states) {
                    context.commit('setPlayerStates', states);

                    const roomId: string = context.rootGetters['roomModule/getId'];
                    if (!roomId) {
                        console.warn('Could not retrieve room ID... Did not update player state.');
                        return;
                    }
                    context.commit('setPlayerState', states[roomId]);
                }
            };

            socket.onclose = (event) => {
                if (event.wasClean) {
                    console.log(`Websocket connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    console.warn(`Websocket connection died`);
                }

                context.dispatch("initializeSocketConnection");
            };

            socket.onerror = (error: any) => {
                console.error(error.message)
            };
        },
        updateVideoStateLocally: (context: ActionContext<any, any>, videoState: VideoState) => {
            console.log("Updating local video player state...", videoState);
            const playerState: VideoPlayerState = context.state.playerState;
            playerState.videoState = videoState;
            context.commit('setPlayerState', playerState);
        },
        updateVideoStateOnServer: async (context: ActionContext<any, any>, newState: VideoState) => {
            console.log("Updating video state on server...", newState);

            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.warn('Did not update server state for room', roomId);
                return;
            }


            const password: string = context.rootGetters['passwordModule/getPassword'];

            const socket = context.getters['getSocket'];
            socket.send(JSON.stringify({
                type: 'update-video-state',
                roomId: roomId,
                state: newState,
                pw: password
            }));
        },
        resetRoomShowOnServer: async (context: ActionContext<any, any>) => {
            console.log("Resetting room on server...");
            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.warn('Did not reset show for room', roomId);
                return;
            }

            const password: string = context.rootGetters['passwordModule/getPassword'];
            const socket = context.getters['getSocket'];
            socket.send(JSON.stringify({
                type: 'reset-video',
                roomId: roomId,
                pw: password
            }));
        },
        goToNextVideoOnServer: async (context: ActionContext<any, any>) => {
            console.log("Go to next video on server...");

            const roomId: string = context.rootGetters['roomModule/getId'];
            if (!roomId) {
                console.log('Did not update server state for room', roomId);
                return;
            }

            const password: string = context.rootGetters['passwordModule/getPassword'];
            if(!password || password === "" ){
                return Promise.reject('No password entered');
            }

            const socket = context.getters['getSocket'];
            socket.send(JSON.stringify({
                type: 'next-video',
                roomId: roomId,
                pw: password
            }));
        },
    },
    getters: {
        getState: (state: any) => {
            return state.playerState;
        },
        getSocket: (state: any) => {
            return state.socket;
        },
        getStates: (state: any) => {
            return state.playerStates;
        },
        getVideoPath: (state: any): string | null => {
            const currentTheme = state.playerState.currentTheme;
            if (currentTheme === 'religion') {
                return '725627120';
            } else if (currentTheme === 'migration') {
                return '725625538';
            } else if (currentTheme === 'sexuality') {
                return '725989285';
            } else {
                console.warn("Could not find video for theme:", currentTheme)
                return null;
            }
        }
    },
};

export default videoStateModule;
