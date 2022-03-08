import {getThemeIdByStr, isValidThemeIdStr, ThemeId} from '../../../models/theme-id';
import {root} from 'postcss';
import {VideoPlayerState} from '../../../models/video-state';

const themeModule = {
    namespaced: true,
    state() {
        return {
            id: null
        };
    },
    mutations: {
        selectById: (state, themeIdStr: string) => {
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
        getId: (state): ThemeId => {
            return state.id;
        },
        getIdStr: (state): string => {
            return ThemeId[state.id];
        },
        getVideoPath: (state, getters, rootState, rootGetters): string => {
            const themeId: string = getters.getIdStr;
            const playerState: VideoPlayerState = rootGetters['videoStateModule/getState'];
            if(!playerState) {
                return '';
            }
            const videoNum = playerState.videoNum;
            return `/videos/${themeId}/${themeId}-${videoNum+1}.m4v`;
        }
    },
};

export default themeModule;
