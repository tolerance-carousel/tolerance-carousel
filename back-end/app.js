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

app.get('/', (req, res) => {
    res.json(states);
});

app.get('/get-states', (req, res) => {
    res.json(states);
});

app.get('/update-state', (req, res) => {
    const themeId = req.query.themeId;
    const themeIdIsValid = themeId && Object.keys(states).includes(themeId);
    if (!themeIdIsValid) {
        console.warn("Invalid theme ID:", themeId);
        res.json("Invalid theme ID.");
        return;
    }

    const state = req.query.state;
    const stateIsValid = state && State.GetAllNames().includes(state);
    if (!stateIsValid) {
        console.warn("Invalid state:", state);
        res.json("Invalid state.");
        return;
    }

    states[themeId] = state;
    res.json(states);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
