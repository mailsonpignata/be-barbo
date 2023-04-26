const { compare, encrypt, makeHash, createHash } = require('./secure');
const { returnError } = require('./returnError');
const { sendEmail } = require('./nodemailer');

exports.compare = compare;
exports.encrypt = encrypt;
exports.makeHash = makeHash;
exports.createHash = createHash;
exports.returnError = returnError;
exports.sendEmail = sendEmail;
