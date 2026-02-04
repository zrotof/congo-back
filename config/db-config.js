require("dotenv").config();

const { db } = require('../config/dot-env')
module.exports = {
  development: {
    username: db.username,
    password: db.password,
    database: db.name,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    username: db.username,
    password: db.password,
    database: db.name,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 5000,
    },
  },
  rsa: {
    publicKeyFilename: process.env.RSA_PUBLIC_KEY_FILENAME,
    privateKeyFilename: process.env.RSA_PRIVATE_KEY_FILENAME,
    keysDir: process.env.RSA_KEYS_DIR
  },
  production: {
    username: db.username,
    password: db.password,
    database: db.name,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 30000,
    },
  },
};
