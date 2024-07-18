const bcrypt = require("bcryptjs");

exports.hash = (input) => bcrypt.hash(input, 12);
exports.compare = (plainText, hashValue) =>
  bcrypt.compare(plainText, hashValue);

exports.generateSecretCode = () => {
  const secretCode = Math.random().toString(36).substr(2, 6);
  return secretCode;
};
