import {PolisIds} from "../../../models/polis-ids";
import {ActionContext} from "vuex";

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
        },
        getServerLocationFromServer: async (context: ActionContext<any, any>): Promise<string> => {
            console.log("Retrieving server location from server...", import.meta.env);
            return await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/get-server-location`,
                responseType: 'json'
            }, {root: true}).catch(error => {
                console.warn('Could not retrieve server location from server...', error);
            });
        },
        updateServerLocationOnServer: async (context: ActionContext<any, any>, updatedServerLocation: string): Promise<string> => {
            console.log("Updating server location on server...", import.meta.env);
            const password: string = context.rootGetters['passwordModule/getPassword'];
            return await context.dispatch('sendHttpRequest', {
                url: `${import.meta.env.APP_SERVER_URL}/update-server-location?pw=${password}&updatedServerLocation=${updatedServerLocation}`,
                responseType: 'json'
            }, {root: true}).catch(error => {
                console.warn('Could not update server location on server...', error);
            });
        },
    },
    getters: {},
};

export default polisModule;
