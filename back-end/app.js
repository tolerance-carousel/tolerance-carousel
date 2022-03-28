const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {VideoState} = require("./models/video-state");

const TIME_BEFORE_NEW_VIDEO_STARTS = 10 * 1000; // 60 * 1000;
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

const playerStates = {
    "religion": {
        videoState: VideoState.Welcome.name,
        videoNum: 0,
        totalVideoNum: 1,
        startsAt: Date.now() + TIME_BEFORE_NEW_VIDEO_STARTS
    },
    "sexuality": {
        videoState: VideoState.Welcome.name,
        videoNum: 0,
        totalVideoNum: 3,
        startsAt: Date.now() + TIME_BEFORE_NEW_VIDEO_STARTS
    },
    "migration": {
        videoState: VideoState.Welcome.name,
        videoNum: 0,
        totalVideoNum: 2,
        startsAt: Date.now() + TIME_BEFORE_NEW_VIDEO_STARTS
    }
}

function isVideoStateValid(state) {
    return state && VideoState.GetAllNames().includes(state);
}

function isThemeIdValid(themeId) {
    return themeId && Object.keys(playerStates).includes(themeId);
}

app.get('/', (req, res) => {
    res.json(playerStates);
});

app.get('/get-state', (req, res) => {
    const themeId = req.query.themeId;
    if (!isThemeIdValid(themeId)) {
        console.warn("Invalid theme ID:", themeId);
        return res.status(400).send({
            message: 'Invalid theme ID'
        });
    }
    res.json(playerStates[themeId]);
});

app.get('/get-states', (req, res) => {
    res.json(playerStates);
});

app.get('/update-video-state', (req, res) => {
    const themeId = req.query.themeId;
    if (!isThemeIdValid(themeId)) {
        return res.status(400).send({
            message: 'Invalid theme ID'
        });
    }

    const state = req.query.state;
    if (!isVideoStateValid(state)) {
        return res.status(400).send({
            message: 'Invalid state'
        });
    }

    playerStates[themeId].videoState = state;

    if (state === VideoState.Welcome.name) {
        playerStates[themeId].startsAt = Date.now() + TIME_BEFORE_NEW_VIDEO_STARTS;
    }

    res.json(playerStates);
});

app.get('/next-video', (req, res) => {
    const themeId = req.query.themeId;
    if (!isThemeIdValid(themeId)) {
        return res.status(400).send({
            message: 'Invalid theme ID'
        });
    }

    playerStates[themeId].videoNum++;
    if (playerStates[themeId].videoNum > playerStates[themeId].totalVideoNum - 1) {
        playerStates[themeId].videoNum = 0;
        playerStates[themeId].videoState = VideoState.Welcome.name;
    } else {
        playerStates[themeId].videoState = VideoState.PlayingVideo.name;
    }
    res.json(playerStates);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
