import {ActionContext, createStore} from 'vuex';
import {VideoState} from '../models/video-state';

const store = createStore({
    modules: {},
    state() {
        return {
            'themeId': 'sexuality',
            'videoState': VideoState.Idle
        };
    },
    mutations: {},
    getters: {},
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
        updateVideoState: async (context: ActionContext<any, any>, newVideoState: VideoState) => {
            console.log('Updating video state...', context.rootState.videoState, '->', newVideoState);
            const themeId = context.rootState.themeId;
            const updateResponse = await context.dispatch('sendHttpRequest', {
                url: `http://localhost:4000/update-state?themeId=${themeId}&state=${newVideoState}`,
                responseType: 'json'
            });
            console.log('Server state:', updateResponse);
        }
    },
});

export default store;
