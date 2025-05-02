const { getDb, writeToDb } = require('./utils')
const { SESSIONS } = require('./sessions')
const crypto = require('crypto');

const DB_PATH = './db.json'
const SONG_SEARCH_QUERIES = ['name', 'artist', 'genre', 'album'];

const login = (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).send({error: 'Credentials are missing'});

    if (email === 'test@axxes.com' && password === 'test') {
      const authToken = crypto.randomUUID();
      SESSIONS.set(authToken);

      return res
        .cookie('authToken', authToken, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        })
        .send({message: 'login successful'})
    }
    res.status(401).send({error: 'Email or password incorrect'})
  } catch (error) {
    console.error(error);
    res.status(500).send({error: error.message})
  }
}

const filterAndReturnSongs = (req, res, row) => {
  const searchQueries = filterOnSearchParameters(req.query)
  const hasNoSearchQueries = !searchQueries.length

  try {
    const db = getDb(DB_PATH)[row]

    if (hasNoSearchQueries) {
      return res.status(200).send(pagination(db, req.query));
    }

    const filteredSongs = filterSongsOnMultipleQueries(searchQueries, row);
    res.status(200).send(pagination(filteredSongs, req.query))
  } catch (error) {
    console.error(error);
    res.status(500).send({error: error.message})
  }
}

const pagination = (itemsList, parameters) => {
  const { pageNumber, amountPerPage } = parameters

  if (pageNumber && amountPerPage) {
    const start = Number((pageNumber - 1)) * Number(amountPerPage);
    const end = Number(start) + Number(amountPerPage);

    if (start < 0) throw new Error('pageNumber cannot be lower then 1')

    return itemsList.slice(start, end)
  }
  return itemsList;
}

const modifySavedSongs = (song, res, action) => {
  try {
    if (!song) return res.status(400).send({error: `no ${action === 'ADD' ? 'song' : 'songId'} provided`})

    const db = getDb(DB_PATH)

    switch (action) {
      case 'REMOVE': {
        db.saved = db.saved.filter((el) => el.id !== Number(song))
        break;
      }
      case 'ADD': {
        db.saved.push(song)
        break;
      }
    }
    writeToDb(DB_PATH, db)
    return res.status(200).send({message:`${action} song`});
  } catch (error) {
    res.status(500).send({error: error.message})
  }
}

const filterOnSearchParameters = (parameters) => {
  return Object.entries(parameters)?.filter(([key]) => SONG_SEARCH_QUERIES.includes(key))
}

const filterSongsOnMultipleQueries = (searchQueries, row) => {
  return getDb(DB_PATH)[row].filter((song) => {
    return searchQueries.some(([key, value]) => {
      return song[key]?.toLowerCase().includes(value?.toLowerCase());
    });
  });
};

module.exports = {
  modifySavedSongs,
  filterAndReturnSongs,
  login
}