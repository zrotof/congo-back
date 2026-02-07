"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GlobalStat extends Model {
    static associate(models) { }
  }

  GlobalStat.init({
    totalVisits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: "GlobalStat",
    tableName: "GlobalStats"
  });

  return GlobalStat;
};