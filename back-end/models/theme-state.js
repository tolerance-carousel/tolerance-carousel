class State {
    static Idle = new State("idle")
    static PlayingVideo = new State("playingVideo")
    static EnteringInput = new State("enteringInput")


    static GetAllNames = function () {
        return [State.Idle.name, State.PlayingVideo.name, State.EnteringInput.name];
    }

    constructor(name) {
        this.name = name
    }
}

module.exports = {State};
