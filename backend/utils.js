const fs = require('fs')

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const getDb = (path) => JSON.parse(fs.readFileSync(path))

const writeToDb = (path, data) => fs.writeFileSync(path, JSON.stringify(data))

module.exports = {
  delay,
  getDb,
  writeToDb
}