export enum VideoState {
    Welcome = 'welcome',
    Playing = 'playingVideo',
    EnteringInput = 'enteringInput',
    ServerError = 'serverError',
}

export type VideoPlayerStates = { [roomId: string]: VideoPlayerState };

export interface VideoPlayerState {
    currentTheme: string;
    videoState: VideoState;
    startsAt: number;
}
