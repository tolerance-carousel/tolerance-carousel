class ThemeState {
    static Idle = new ThemeState("idle")
    static PlayingVideo = new ThemeState("playingVideo")
    static UserInteracting = new ThemeState("enteringResponses")

    static GetAllNames = function () {
        return [ThemeState.Idle.name, ThemeState.PlayingVideo.name, ThemeState.UserInteracting.name];
    }

    constructor(name) {
        this.name = name
    }
}

module.exports = {ThemeState};
