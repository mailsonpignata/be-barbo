const bcrypt = require('bcrypt')

const encrypt = async function (password) {
  // console.log('password', bcrypt.hash(password, 10))
  return bcrypt.hash(password, 10)
}

const compare = function (password, dbPassword) {
  console.log('password', password, dbPassword)
  return bcrypt.compareSync(password, dbPassword)
}

const makeHash = function (max = 9) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ000123456789abcdefghijklmnopqrstuvwxyz000123456789'
  for (let i = 0; i < max; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const createHash = function (value) {
  console.log("🚀 ~ file: secure.js:23 ~ createHash ~ value:", value)
  var hash = 0,
  i, chr;
  if (value.length === 0) return hash;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

exports.encrypt = encrypt
exports.compare = compare
exports.makeHash = makeHash
exports.createHash = createHash
