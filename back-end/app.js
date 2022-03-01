const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {ThemeState} = require("./models/theme-state");

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

const themeStates = {
    "religion": ThemeState.Idle.name,
    "sexuality": ThemeState.Idle.name,
    "migration": ThemeState.Idle.name
}

app.get('/', (req, res) => {
    res.json(themeStates);
});

app.get('/get-theme-states', (req, res) => {
    res.json(themeStates);
});

app.get('/update-theme-state', (req, res) => {
    const themeId = req.query.themeId;
    const themeIdIsValid = themeId && Object.keys(themeStates).includes(themeId);
    if (!themeIdIsValid) {
        console.warn("Invalid theme ID:", themeId);
        res.json("Invalid theme ID.");
        return;
    }

    const themeState = req.query.themeState;
    const themeStateIsValid = themeState && ThemeState.GetAllNames().includes(themeState);
    if (!themeStateIsValid) {
        console.warn("Invalid theme state:", themeState);
        res.json("Invalid theme state.");
        return;
    }

    themeStates[themeId] = themeState;
    res.json(themeStates);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
