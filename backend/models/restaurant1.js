'use strict';
const Joi = require('joi');
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Dish, Orders}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.hasMany(Dish, {foreignKey:"restaurant_id"})
      this.hasMany(Orders, {foreignKey:"restaurant_id"})
    }
  };

  Restaurant.schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

    description: Joi.string()
      .alphanum()
      .required(),
    
    deliveryType: Joi.string().required(),
    
    profile_picture: Joi.string().allow(null, ''),
    
    location: Joi.string().required(),

    address: Joi.string().required(),

    // startTime: Joi.string()
    
  }).unknown(true);


  Restaurant.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    startTime: DataTypes.TIME,
    deliveryType: DataTypes.STRING,
    endTime: DataTypes.TIME,
    profile_picture: DataTypes.STRING,
    location: DataTypes.STRING,
    address : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};