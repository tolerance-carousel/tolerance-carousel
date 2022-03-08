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
        }
    },
};

export default themeModule;
