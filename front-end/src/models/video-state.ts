export enum VideoState {
    Idle = 'idle',
    ServerError = 'serverError',
    Playing = 'playingVideo',
    EnteringInput = 'enteringInput',
}

export interface VideoPlayerState {
    videoState: VideoState;
    videoNum: number;
}
