export enum VideoState {
    Welcome = 'welcome',
    Playing = 'playingVideo',
    EnteringInput = 'enteringInput',
    ServerError = 'serverError',
}

export interface VideoPlayerState {
    videoState: VideoState;
    videoNum: number;
}
