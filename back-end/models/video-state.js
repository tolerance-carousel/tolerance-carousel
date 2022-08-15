export class VideoState {
    static Welcome = new VideoState("welcome")
    static PlayingVideo = new VideoState("playingVideo")
    static EnteringInput = new VideoState("enteringInput")
    static ThankYou = new VideoState("thankYou")

    static GetAllNames = function () {
        return [VideoState.PlayingVideo.name, VideoState.EnteringInput.name, VideoState.Welcome.name, VideoState.ThankYou.name];
    }

    constructor(name) {
        this.name = name
    }
}

