const { compare, encrypt, makeHash } = require('./secure');
const { returnError } = require('./returnError');
const { sendEmail } = require('./nodemailer');

exports.compare = compare;
exports.encrypt = encrypt;
exports.makeHash = makeHash;
exports.returnError = returnError;
exports.sendEmail = sendEmail;
