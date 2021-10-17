'use strict';
const {
  Model
} = require('sequelize');
const Joi = require('joi')

module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({Restaurant}) {
      // define association here
      this.belongsTo(Restaurant, {foreignKey: "restaurant_id"})

    }
  };


  Dish.schema = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    image: Joi.number().required(),
    category : Joi.string().required(),
    cuisine : Joi.string().required(),
    type : Joi.string().required()
    
  }).unknown(true);



  Dish.init({
    name: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    category: DataTypes.STRING,
    cuisine : DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dish',
  });
  return Dish;
};