import {PolisIds} from "../../../models/polis-ids";
import {ActionContext} from "vuex";
import {VideoState} from "../../../models/video-state";

const polisModule = {
    namespaced: true,
    state() {
        return {};
    },
    mutations: {},
    actions: {
        getPolisIdsFromServer: async (context: ActionContext<any, any>): Promise<PolisIds> => {
            console.log("Retrieving Polis IDs from server...", import.meta.env);
            return await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/get-polis-ids`,
                responseType: 'json'
            }, {root: true}).catch(error => {
                console.warn('Could not retrieve Polis IDs from server...', error);
            });
        },
        updatePolisIdsOnServer: async (context: ActionContext<any, any>, updatedPolisIds: PolisIds): Promise<PolisIds> => {
            console.log("Updating Polis IDs on server...", import.meta.env);
            const password: string = context.rootGetters['passwordModule/getPassword'];
            return await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/update-polis-ids?pw=${password}&updatedIds=${JSON.stringify(updatedPolisIds)}`,
                responseType: 'json'
            }, {root: true}).catch(error => {
                console.warn('Could not update Polis IDs on server...', error);
            });
        }
    },
    getters: {},
};

export default polisModule;
