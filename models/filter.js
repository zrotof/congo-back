'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Filter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Filter.init({
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    filterUrl: DataTypes.STRING,
    usageCount: DataTypes.INTEGER,
    platform: {
      type: DataTypes.ENUM('SNAPCHAT', 'TIKTOK'),
      defaultValue: 'SNAPCHAT',
      validate: {
        isIn: [['SNAPCHAT', 'TIKTOK']]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Filter',
  });
  return Filter;
};