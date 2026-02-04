"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    static associate(models) { }
  }
  Challenge.init({
    title: { type: DataTypes.STRING, allowNull: false },
    contextText: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    blurredImageUrl: DataTypes.STRING,
    targetViews: { type: DataTypes.INTEGER, defaultValue: 1000 },
    currentViews: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: "Challenge",
  });
  return Challenge;
};