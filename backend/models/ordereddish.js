'use strict';
const {
  Model
} = require('sequelize');
const Joi = require('joi');

module.exports = (sequelize, DataTypes) => {
  class OrderedDish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Orders}) {
      // define association here
      this.belongsTo(Orders, {foreignKey:"order_id"})
    }
  };

  OrderedDish.schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),    
  }).unknown(true);


  OrderedDish.init({
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    qty : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderedDish',
  });
  return OrderedDish;
};