import {WebSocketServer, WebSocket} from 'ws';
import {VideoState} from "./models/video-state.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

const TIME_TO_ENTER_INPUT = 60 * 5 * 1000;

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

let polisIds = {
    "religion": "8fvwmjnfxe",
    "migration": "49v4meperm",
    "sexuality": "2jic4d2hbr"
}
let serverLocation = "nl";

const themeIds = ["religion", "migration", "sexuality"];


function isPasswordValid(password) {
    return password === "WeLoveTolerance!";
}

function isVideoStateValid(state) {
    return state && VideoState.GetAllNames().includes(state);
}

// function isThemeIdValid(themeId) {
//     return themeId && themeIds.includes(themeId);
// }

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

const wss = new WebSocketServer({port: 4000});
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('Received: %s', data);
        data = JSON.parse(data);
        if(data.type === 'update-video-state') {
            updateVideoState(data.roomId, data.pw, data.state);
        } else if(data.type === 'reset-video') {
            resetVideo(data.roomId, data.pw);
        } else if(data.type === 'next-video') {
            goToNextVideo(data.roomId, data.pw);
        } else {
            console.warn("Unknown request...");
        }
    });

    updateSocketClient(ws);
});

async function updateAllSocketClients() {
    if(!wss) {
        console.warn("Could not update socket clients, socket not defined...");
    }

    console.log("Updating socket clients..."); // , states);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            updateSocketClient(client);
        }
    });
}

function updateSocketClient(client) {
    client.send(JSON.stringify(states));
}

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

// TODO: Handle using websocket as well?
app.get('/get-polis-ids', (req, res) => {
    console.log("Retrieving Polis IDs...");
    res.json(polisIds);
});

app.get('/update-polis-ids', (req, res) => {
    const pw = req.query.pw;
    if (!isPasswordValid(pw)) {
        console.warn("Invalid password when updating Polis IDs");
        return res.status(401).send({
            message: 'Invalid password'
        });
    }
    try {
        const updatedIds = JSON.parse(req.query.updatedIds);
        polisIds = updatedIds;
    } catch (e) {
        console.error("Could not parse Polis IDs...");
        return res.status(500).send({
            message: 'Could not parse passed IDs'
        });
    }

    console.log("Updating Polis IDs...");
    res.json(polisIds);
});

app.get('/get-server-location', (req, res) => {
    res.json(serverLocation);
});

app.get('/update-server-location', (req, res) => {
    const pw = req.query.pw;
    if (!isPasswordValid(pw)) {
        console.warn("Invalid password when updating server location");
        return res.status(401).send({
            message: 'Invalid password'
        });
    }

    console.log("Updating server location...");
    serverLocation = req.query.updatedServerLocation;
    res.json(serverLocation);
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

const updateVideoState = (roomId, pw, state) => {
    console.log("Updating video state...");
    if (!isRoomIdValid(roomId)) {
        console.warn('Invalid room ID');
        return;
    }

    if (!isPasswordValid(pw)) {
        console.warn('Invalid password');
        return;
    }

    if (!isVideoStateValid(state)) {
        console.warn('Invalid state');
        return;
    }

    states[roomId].videoState = state;

    if (state === VideoState.EnteringInput.name) {
        states[roomId].startsAt = Date.now() + TIME_TO_ENTER_INPUT;

        // if (states[roomId].currentTheme === "religion") {
        //     // Add one minute for the first round
        //     states[roomId].startsAt += 60 * 1000;
        // }
    } else {
        states[roomId].startsAt = -1;
    }

    void updateAllSocketClients();
}

const resetVideo = (roomId, pw) => {
    if (!isRoomIdValid(roomId)) {
        console.warn('Invalid room ID')
        return;
    }

    if (!isPasswordValid(pw)) {
        console.warn('Invalid password')
        return;
    }

    states[roomId].videoState = VideoState.Welcome.name;
    states[roomId].currentTheme = themeIds[0];
    states[roomId].startsAt = -1;

    void updateAllSocketClients();
}

const goToNextVideo = (roomId, pw) => {
    if (!isRoomIdValid(roomId)) {
        console.warn('Invalid room ID')
        return;
    }

    if (!isPasswordValid(pw)) {
        console.warn('Invalid password');
        return;
    }

    const hasNextTheme = getNextTheme(states[roomId].currentTheme);
    if (hasNextTheme) {
        states[roomId].currentTheme = hasNextTheme;
        states[roomId].videoState = VideoState.PlayingVideo.name;
    } else {
        states[roomId].currentTheme = themeIds[0];
        states[roomId].videoState = VideoState.ThankYou.name;
    }

    void updateAllSocketClients();
};