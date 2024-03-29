import {ActionContext, createStore} from 'vuex';
import videoStateModule from './modules/video-state';
import {ThemeId} from '../models/theme-id';
import roomModule from "./modules/room";
import passwordModule from "./modules/password";
import polisModule from "./modules/polis";

interface State {
    themeId: ThemeId | null
}

const store = createStore<State>({
    modules: {videoStateModule, roomModule, passwordModule, polisModule},
    actions: {
        sendHttpRequest: async ({commit, dispatch, state}, {url, responseType, alertForIncorrectPassword = true}) => {
            return new Promise(function (resolve, reject) {
                const xhr = new XMLHttpRequest();
                xhr.responseType = responseType;
                xhr.onload = async (event) => {
                    if(xhr.status === 401) {
                        if(alertForIncorrectPassword) {
                            alert("Invalid password");
                        }

                        return reject({
                            status: xhr.status,
                            statusText: xhr.statusText,
                        });
                    }
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
