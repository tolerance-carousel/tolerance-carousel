class VideoState {
    static Idle = new VideoState("idle")
    static Welcome = new VideoState("welcome")
    static PlayingVideo = new VideoState("playingVideo")
    static EnteringInput = new VideoState("enteringInput")

    static GetAllNames = function () {
        return [VideoState.Idle.name, VideoState.PlayingVideo.name, VideoState.EnteringInput.name, VideoState.Welcome.name];
    }

    constructor(name) {
        this.name = name
    }
}

module.exports = {VideoState};
