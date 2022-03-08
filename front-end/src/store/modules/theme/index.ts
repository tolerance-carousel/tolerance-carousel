import {getThemeIdByStr, isValidThemeIdStr, ThemeId} from '../../../models/theme-id';

const themeModule = {
    namespaced: true,
    state() {
        return {
            id: null
        };
    },
    mutations: {
        selectById: (state: any, themeIdStr: string) => {
            if (isValidThemeIdStr(themeIdStr)) {
                state.id = getThemeIdByStr(themeIdStr);
                console.log("Selected theme:", state.id);
                return;
            }
            console.warn('Invalid theme ID passed, no new theme selected:', themeIdStr);
        }
    },
    actions: {

    },
    getters: {
        getId: (state: any): ThemeId => {
            return state.id;
        },
        getIdStr: (state: any): string => {
            return ThemeId[state.id];
        },
        getVideoPath: (state: any, getters): string => {
            const themeId: string = getters.getIdStr;
            return `/videos/${themeId}/${themeId}.m4v`;
        }
    },
};

export default themeModule;
