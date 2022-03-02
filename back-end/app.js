const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {State} = require("./models/theme-state");

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

const states = {
    "religion": State.Idle.name,
    "sexuality": State.Idle.name,
    "migration": State.Idle.name
}

function isStateValid(state) {
    return state && State.GetAllNames().includes(state);
}

function isThemeIdValid(themeId) {
    return themeId && Object.keys(states).includes(themeId);
}

app.get('/', (req, res) => {
    res.json(states);
});

app.get('/get-state', (req, res) => {
    const themeId = req.query.themeId;
    if (!isThemeIdValid(themeId)) {
        console.warn("Invalid theme ID:", themeId);
        return res.status(400).send({
            message: 'Invalid theme ID'
        });
    }
    res.json(states[themeId]);
});

app.get('/get-states', (req, res) => {
    res.json(states);
});

app.get('/update-state', (req, res) => {
    const themeId = req.query.themeId;
    if (!isThemeIdValid(themeId)) {
        console.warn("Invalid theme ID:", themeId);
        return res.status(400).send({
            message: 'Invalid theme ID'
        });
    }

    const state = req.query.state;
    if (!isStateValid(state)) {
        console.warn("Invalid state:", state);
        return res.status(400).send({
            message: 'Invalid state'
        });
    }

    states[themeId] = state;
    res.json(states);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
