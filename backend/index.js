const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { delay } = require('./utils.js')
const { checkIfAuthenticated } = require('./validators.js')
const { filterAndReturnSongs, modifySavedSongs, login } = require('./controllers.js')
const { SESSIONS } = require('./sessions')

const PORT = 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());

// app.all('*', (req, res, next) => checkIfAuthenticated(req, res, next, SESSIONS))

app.post('/login', (req, res) => {
  login(req, res)
});

app.get('/songs', async (req, res) => {
  // Don't remove, this is to fake a slow API.
  // See how you can handle this the best in the Frontend
  if (process.argv.includes('delay')) {
    await delay(1250)
  }

  filterAndReturnSongs(req, res, 'songs')
});

app.get('/saved', async (req, res) => {
  filterAndReturnSongs(req, res, 'saved')
});

app.post('/saved', async (req, res) => {
  modifySavedSongs(req.body, res, 'ADD')
});

app.delete('/saved', async (req, res) => {
  const {songId} = req.query;
  modifySavedSongs(songId, res, 'REMOVE')
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});


