import {createStore} from 'vuex';
import {VideoState} from '../models/video-state';

const store = createStore({
    modules: {},
    state() {
        return {
            'themeId': 'religion',
            'videoState': VideoState.Idle
        };
    },
    mutations: {},
    getters: {
        getThemeId: (state: any) => {
            return state.themeId;
        },
    },
    actions: {
        sendHttpRequest: async (context, {url, responseType}) => {
            return new Promise(function (resolve, reject) {
                const xhr = new XMLHttpRequest();
                xhr.responseType = responseType;
                xhr.onload = async (event) => {
                    return resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText,
                    });
                };
                xhr.open('GET', url);
                xhr.send();
            });
        },
        updateVideoState: (context, newVideoState: VideoState) => {
            console.log('Updating video state...', context.rootState.videoState, '->', newVideoState)
            // TODO: Implement
            return;
        }
    },
});

export default store;
