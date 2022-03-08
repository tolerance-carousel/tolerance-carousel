export enum VideoState {
    Idle = 'idle',
    ServerError = 'serverError',
    Welcome = 'welcome',
    Playing = 'playingVideo',
    EnteringInput = 'enteringInput',
}

export interface VideoPlayerState {
    videoState: VideoState;
    videoNum: number;
}
