'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SnapFilter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SnapFilter.init({
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    snapchatUrl: DataTypes.STRING,
    usageCount: DataTypes.INTEGER,
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  }, {
    sequelize,
    modelName: 'SnapFilter',
  });
  return SnapFilter;
};