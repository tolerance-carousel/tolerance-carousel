import {createStore} from 'vuex';
import videoStateModule from './modules/video-state';

const store = createStore({
    modules: { videoStateModule },
    state() {
        return {
            'themeId': 'sexuality',
        };
    },
    mutations: {
    },
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
    },
});

export default store;
