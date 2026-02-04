const crypto = require("crypto");

exports.generateHashedPasswordAndSalt = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const generatedHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: generatedHash,
  };
}

exports.isPasswordValid = (password, hashedPassword, salt) => {
  const newUserPasswordHashed = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hashedPassword === newUserPasswordHashed;
}