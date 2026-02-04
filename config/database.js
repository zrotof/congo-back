const Sequelize = require('sequelize');

const { environment } = require("./dot-env");

const dbConfig = require('../config/db-config')[environment];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    port: dbConfig.port
});

module.exports = sequelize;