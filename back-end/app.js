const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {VideoState} = require("./models/video-state");

const TIME_TO_ENTER_INPUT = 120 * 1000;
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

const states = {
    "room_1": {
        currentTheme: "religion",
        videoState: VideoState.Welcome.name,
        startsAt: -1
    },
    "room_2": {
        currentTheme: "religion",
        videoState: VideoState.Welcome.name,
        startsAt: -1
    },
    "room_3": {
        currentTheme: "religion",
        videoState: VideoState.Welcome.name,
        startsAt: -1
    }
};

const themeIds = ["religion", "migration", "sexuality"];

function isPasswordValid(password) {
    return password === "WeLoveTolerance!";
}

function isVideoStateValid(state) {
    return state && VideoState.GetAllNames().includes(state);
}

function isThemeIdValid(themeId) {
    return themeId && themeIds.includes(themeId);
}

function isRoomIdValid(roomId) {
    return roomId && Object.keys(states).includes(roomId);
}

function getNextTheme(currentTheme) {
    if (currentTheme === "religion") {
        return "migration";
    }
    if (currentTheme === "migration") {
        return "sexuality";
    }
    // if (currentTheme === "sexuality") {
    //     return "religion";
    // }
    return undefined;
}

app.get('/', (req, res) => {
    res.json(states);
});

app.get('/get-state', (req, res) => {
    const roomId = req.query.roomId;
    if (!isRoomIdValid(roomId)) {
        console.warn("Invalid room ID:", roomId);
        return res.status(400).send({
            message: 'Invalid room ID'
        });
    }
    res.json(states[roomId]);
});

app.get('/get-states', (req, res) => {
    res.json(states);
});

app.get('/update-video-state', (req, res) => {
    const roomId = req.query.roomId;
    if (!isRoomIdValid(roomId)) {
        return res.status(400).send({
            message: 'Invalid room ID'
        });
    }

    const pw = req.query.pw;
    if(!isPasswordValid(pw)) {
        return res.status(401).send({
            message: 'Invalid password'
        });
    }

    const state = req.query.state;
    if (!isVideoStateValid(state)) {
        return res.status(400).send({
            message: 'Invalid state'
        });
    }

    states[roomId].videoState = state;

    if (state === VideoState.EnteringInput.name) {
        states[roomId].startsAt = Date.now() + TIME_TO_ENTER_INPUT;
    } else {
        states[roomId].startsAt = -1;
    }

    res.json(states);
});

app.get('/reset-video', (req, res) => {
    const roomId = req.query.roomId;
    if (!isRoomIdValid(roomId)) {
        return res.status(400).send({
            message: 'Invalid room ID'
        });
    }

    const pw = req.query.pw;
    if(!isPasswordValid(pw)) {
        return res.status(401).send({
            message: 'Invalid password'
        });
    }

    states[roomId].videoState = VideoState.Welcome.name;
    states[roomId].currentTheme = themeIds[0];
    states[roomId].startsAt = -1;
    res.json(states);
});

app.get('/next-video', (req, res) => {
    const roomId = req.query.roomId;
    if (!isRoomIdValid(roomId)) {
        return res.status(400).send({
            message: 'Invalid room ID'
        });
    }

    const pw = req.query.pw;
    if(!isPasswordValid(pw)) {
        return res.status(401).send({
            message: 'Invalid password'
        });
    }

    const hasNextTheme = getNextTheme(states[roomId].currentTheme);
    if (hasNextTheme) {
        states[roomId].currentTheme = hasNextTheme;
        states[roomId].videoState = VideoState.PlayingVideo.name;
    } else {
        states[roomId].currentTheme = themeIds[0];
        states[roomId].videoState = VideoState.ThankYou.name;
    }

    res.json(states);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
